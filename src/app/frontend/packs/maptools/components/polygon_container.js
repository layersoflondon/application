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

                element.properties = this.props.feature.properties;
                this.polygonElement = element;
            }

            return element;
        };
    }

    savePolygon(event) {
        const data = this.polygonElement.leafletElement.toGeoJSON();
        data.properties = this.polygonElement.properties;

        this.props.mapToolsStore.updatePolygon(data.properties.id, data).then(() => {
            this.polygonElement.leafletElement.closePopup();
        });
    }

    render() {
        const coords = this.props.feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);

        const setColour = colour => {
            this.setState({colour: colour});
            this.polygonElement.properties = {...this.polygonElement.properties, colour: colour};
            return true;
        };

        const polygonClicked = event => {
            event.preventDefault();
            return false;
        };

        const popup = <Popup autoClose={false} closeOnClick={false} autoOpen={false}>
            <div feature={this.props.feature}>
                <button onClick={() => setColour('black')}>black</button>
                <button onClick={() => setColour('blue')}>blue</button>
                <button onClick={() => setColour('blue-hatched')}>blue hatched</button>
                <button onClick={() => setColour('red-soft')}>soft red</button>
                <button onClick={() => setColour('red-hatched')}>red hatched</button>
                <button onClick={() => setColour('red')}>red</button>
                <button onClick={() => setColour('yellow')}>yellow</button>

                <hr/>
                <button onClick={this.savePolygon.bind(this)} disabled={this.state.colour === undefined}>Done</button>
            </div>
        </Popup>;

        // const colour = (this.state.colour || this.props.feature.properties.colour) || 'blue';
        let style = {colour: 'blue', stroke: true, weight: 4, dashArray: null, dashOffset: null};
        switch (this.state.colour || this.props.feature.properties.colour) {
            case 'black':
                style.colour = 'black';
                break;
            case 'blue':
                style.colour = 'blue';
                break;
            case 'blue-hatched':
                style.colour = 'royalblue';
                style.dashOffset = 20;
                style.dashArray = '25 10';
                break;
            case 'red-soft':
                style.colour = 'salmon';
                break;
            case 'red-hatched':
                style.colour = 'orangered';
                style.dashOffset = 20;
                style.dashArray = '25 10';
                break;
            case 'red':
                style.colour = 'red';
                break;
            case 'yellow':
                style.colour = 'yellow';
                break;
            default:
                style.colour = 'blue';
                break;
        }

        return <Polygon onClick={polygonClicked} positions={coords} ref={this.polygonRef} color={style.colour} fillColor={style.colour} dashArray={style.dashArray} dashOffset={style.dashOffset}>
            {popup}
        </Polygon>;
    }
}
