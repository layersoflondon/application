import React from 'react';
import { Popup, Polygon } from 'react-leaflet';
import { getStyle } from '../helpers/styles';

export default class PolygonContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.polygonElement = null;

        this.polygonRef = element => {
            // click the polygon to trigger its popup if it has one to prompt the user for the colour
            if( this.props.mapToolsStore.squareId && element && element.leafletElement ) {
                setTimeout(() => {
                    if( (this.state.colour || this.props.feature.properties.colour) === undefined ) {
                        element.leafletElement.openPopup();
                    }

                }, 150);

                element.leafletElement.properties = this.props.feature.properties;
            }

            this.polygonElement = element;
            return element;
        };
    }

    savePolygon(event) {
        const data = this.polygonElement.leafletElement.toGeoJSON();
        data.properties = {...this.polygonElement.properties, ...this.polygonElement.leafletElement.properties};

        this.props.mapToolsStore.updatePolygon(this.polygonElement.leafletElement.properties.id, data).then(() => {
            this.polygonElement.leafletElement.closePopup();
        });
    }

    setColour(event) {
        const {colour} = event.currentTarget.dataset;
        const style = getStyle(colour);

        this.polygonElement.leafletElement.properties = {...this.polygonElement.leafletElement.properties, colour: colour};
        this.polygonElement.leafletElement.setStyle(style);
    }

    render() {
        const coords = this.props.feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);

        const polygonClicked = event => {
            return false;
        };

        const popup = <Popup autoClose={false} closeOnClick={false} autoOpen={false}>
            <div className="m-color-picker" feature={this.props.feature}>
                <button onClick={this.setColour.bind(this)} data-colour='black'>Black</button>
                <button onClick={this.setColour.bind(this)} data-colour='blue'>Blue</button>
                <button onClick={this.setColour.bind(this)} data-colour='blue-hatched'>Blue hatched</button>
                <button onClick={this.setColour.bind(this)} data-colour='red-soft'>Soft red</button>
                <button onClick={this.setColour.bind(this)} data-colour='red-hatched'>Red hatched</button>
                <button onClick={this.setColour.bind(this)} data-colour='red'>Red</button>
                <button onClick={this.setColour.bind(this)} data-colour='yellow'>Yellow</button>
                <button onClick={this.setColour.bind(this)} data-colour='yellow-hatched'>Yellow hatched</button>
                <button onClick={this.setColour.bind(this)} className="unknown" data-colour='unknown'>Too difficult to tell</button>

                <hr/>
                <button className="done-button" onClick={this.savePolygon.bind(this)}>Done</button>
            </div>
        </Popup>;

        const style = getStyle(this.props.feature.properties.colour);

        return <Polygon onClick={polygonClicked} positions={coords} ref={this.polygonRef} {...style}>
            {popup}
        </Polygon>;
    }
}
