import React from 'react';
import { NavLink } from 'react-router-dom';
import { Route } from 'react-router';
import MapView from './map_view';
import Square from './square';
import { inject } from 'mobx-react/index';

@inject('mapToolsStore')
export default class Maptools extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();

        window.mapRef = this.mapRef;
    }

    render() {
        return <React.Fragment>
            <div className="m-map-wrapper">
                <Route exact path={`${this.props.match.path}`} component={MapView} />
                <Route exact path={`${this.props.match.path}/:lat,:lng`} component={Square} />
                <Route exact path={`${this.props.match.path}/1`} component={Square} />
            </div>
        </React.Fragment>
    }
}