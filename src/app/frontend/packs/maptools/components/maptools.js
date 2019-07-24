import React from 'react';
import { NavLink } from 'react-router-dom';
import { Route } from 'react-router';
import MapView from './map_view';
import Square from './square';

export default class Maptools extends React.Component {
    render() {
        return <React.Fragment>
            <div className="m-map-wrapper">
                <Route exact path={`${this.props.match.path}`} component={MapView} />
                <Route exact path={`${this.props.match.path}/:lat,:lng`} component={Square} />
            </div>
        </React.Fragment>
    }
}