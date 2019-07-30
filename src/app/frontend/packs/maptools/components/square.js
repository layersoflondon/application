import React from 'react';
import MapView from './map_view';
import { inject } from 'mobx-react/index';

@inject('mapToolsStore')
export default class Square extends React.Component {
    render() {
        return <React.Fragment>
            Clicked Square at lat: {this.props.match.params.lat}, lng: {this.props.match.params.lng}<hr/>
            <MapView />
        </React.Fragment>
    }
}
