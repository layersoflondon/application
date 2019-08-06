import React from 'react';
import { Popup, Polygon } from 'react-leaflet';

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

    getStyle(colour) {
        const style = {color: 'blue', opacity: 0.6, fillColor: 'blue', stroke: true, weight: 2, dashArray: null, dashOffset: 0};

        switch (colour) {
            case 'black':
                style.color = 'black';
                style.fillColor = 'black';
                break;
            case 'blue-hatched':
                style.color = 'royalblue';
                style.fillColor = 'royalblue';
                style.dashArray = '10 10';
                break;
            case 'red-soft':
                style.color = 'salmon';
                style.fillColor = 'salmon';
                break;
            case 'red-hatched':
                style.color = 'orangered';
                style.fillColor = 'orangered';
                style.dashArray = '10 10';
                break;
            case 'red':
                style.color = 'red';
                style.fillColor = 'red';
                break;
            case 'yellow':
                style.color = 'yellow';
                style.fillColor = 'yellow';
                break;
            case 'yellow-hatched':
                style.color = 'chocolate';
                style.fillColor = 'yellow';
                style.dashArray = '10 10';
                style.opacity = 0.9;
                break;
            case 'unknown':
                style.color = 'white';
                style.fillColor = 'white';
                break;
        }

        return style;
    }

    setColour(event) {
        const {colour} = event.currentTarget.dataset;
        const style = this.getStyle(colour);

        this.polygonElement.leafletElement.properties = {...this.polygonElement.leafletElement.properties, colour: colour};
        this.polygonElement.leafletElement.setStyle(style);
    }

    render() {
        const coords = this.props.feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);

        const polygonClicked = event => {
            return false;
        };

        const popup = <Popup autoClose={false} closeOnClick={false} autoOpen={false}>
            <div feature={this.props.feature}>
                <button onClick={this.setColour.bind(this)} data-colour='black'>black</button>
                <button onClick={this.setColour.bind(this)} data-colour='blue'>blue</button>
                <button onClick={this.setColour.bind(this)} data-colour='blue-hatched'>blue hatched</button>
                <button onClick={this.setColour.bind(this)} data-colour='red-soft'>soft red</button>
                <button onClick={this.setColour.bind(this)} data-colour='red-hatched'>red hatched</button>
                <button onClick={this.setColour.bind(this)} data-colour='red'>red</button>
                <button onClick={this.setColour.bind(this)} data-colour='yellow'>yellow</button>
                <button onClick={this.setColour.bind(this)} data-colour='yellow-hatched'>yellow hatched</button>
                <button onClick={this.setColour.bind(this)} data-colour='unknown'>too difficult to tell</button>

                <hr/>
                <button onClick={this.savePolygon.bind(this)}>Done</button>
            </div>
        </Popup>;

        const style = this.getStyle(this.props.feature.properties.colour);

        return <Polygon onClick={polygonClicked} positions={coords} ref={this.polygonRef} color={style.color} opacity={style.opacity} weight={style.weight} fillColor={style.fillColor} dashArray={style.dashArray} dashOffset={style.dashOffset}>
            {popup}
        </Polygon>;
    }
}
