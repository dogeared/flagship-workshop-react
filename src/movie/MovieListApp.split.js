import React, { useState } from 'react';
import { movies } from './movies.js'
import MovieList from './MovieList.js'
import { SplitFactory, SplitTreatments } from '@splitsoftware/splitio-react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SplitMovieListApp(props) {

    // Filter that accepts only USA movies
    const usaMoviesFilter = (movie) => movie.country === 'USA';

    // Filter that accepts all movies
    const allMoviesFilter = () => true;

    function handleSubmit(event) {
        event.preventDefault();
        props.handleClick();
    }

    const splitConfig = {
        core: {
            authorizationKey: 'localhost', // update to real authorization key
            key: props.email,
        },
        features: {
            'movie_filter': 'USA',
        }
    }

    const [useAllFilter, setUseAllFilter] = useState(false);

    return (
        <SplitFactory config={splitConfig} updateOnSdkUpdate={true} >
            <SplitTreatments /* names: list of features to evaluate */ names={['movie_filter']} >{
                ({ isReady, treatments }) => {
                    if (isReady) {
                        // once the SDK is ready, `treatments` contains valid values of the evaluated list of features

                        let treatment = treatments['movie_filter'].treatment;
                        console.log(`treatment: ${treatment}`);

                        let filter;
                        if (treatment !== 'USA' && useAllFilter) {
                            filter = allMoviesFilter;
                        } else {
                            filter = usaMoviesFilter;
                            setUseAllFilter(false);
                        }

                        const filteredMovies = movies.filter(filter);
                        return (
                            <div>
                                <h2>Hello {props.email}</h2>
                                {treatment !== 'USA' &&
                                    <div>
                                        <input 
                                            type="checkbox" id="filter" 
                                            checked={useAllFilter} 
                                            onChange={() => { setUseAllFilter(!useAllFilter) }} 
                                        />
                                        <label htmlFor="filter">Show International Movies</label>
                                    </div>
                                }
                                <MovieList movies={filteredMovies} />
                                <Form onSubmit={handleSubmit}>
                                    <Button block size="lg" type="submit">
                                        Logout
                                    </Button>
                                </Form>
                            </div>
                        );
                    }

                    return (<div>Loading SDK...</div>);
                }
            }</SplitTreatments>
        </SplitFactory>
    )
}