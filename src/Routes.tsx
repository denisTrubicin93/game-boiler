import React from 'react';
import { Route } from 'react-router-dom';
import { WebcamCapture, TotalArcade } from './containers/Demo';
import Home from './containers/Home';

const Routes = () => {
    return (
        <>
            <Route exact path="/" component={Home} />
            <Route exact path="/demo" component={WebcamCapture} />
            <Route exact path="/total" component={TotalArcade} />
        </>
    );
};

export default Routes;
