import React from 'react';
import MapView from './map_view';
import { inject } from 'mobx-react/index';

@inject('mapToolsStore')
export default class Square extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();

        window.mapRef = this.mapRef;
    }

    componentWillMount() {
        this.props.mapToolsStore.fetchPolygonsForShape(1234);
    }

    render() {
        return <React.Fragment>
            Clicked Square at lat: {this.props.match.params.lat}, lng: {this.props.match.params.lng}<hr/>
            <MapView />
        </React.Fragment>
    }
}
