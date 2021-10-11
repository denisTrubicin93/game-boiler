import React from 'react';
import { Route } from 'react-router-dom';
import Demo from './containers/Demo';
import Home from './containers/Home';

const Routes = () => {
    return (
        <>
            <Route exact path="/" component={Home} />
            <Route exact path="/demo" component={Demo} />
        </>
    );
};

export default Routes;