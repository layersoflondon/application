import React from 'react';
import { Route } from 'react-router';
import MapView from "./map_view";
import MapToolsOverview from "./maptools_overview";
import Squares from "./squares";

export default class MaptoolsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <React.Fragment>
            <div className="m-page-header">
                <Route path='/maptools/squares' component={Squares} />
            </div>
        </React.Fragment>
    }
}