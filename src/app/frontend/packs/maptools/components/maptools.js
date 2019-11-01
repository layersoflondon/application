import React from 'react';
import { inject } from 'mobx-react/index';

@inject('mapToolsStore')
@withRouter
@observer
export default class Maptools extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();

        window.mapRef = this.mapRef;
    }

    render() {
        return <React.Fragment>
            <div className="m-map-wrapper">
            </div>
        </React.Fragment>
    }
}