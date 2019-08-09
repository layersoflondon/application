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

        this.popupRef = React.createRef();
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

        const previousColour = event.target.parentElement.querySelector(".is-current");
        if( previousColour ) {
            previousColour.classList.remove("is-current");
        }

        event.currentTarget.classList.add("is-current");

        // // we cant use setState here as React draw loses its ref to the leaflet dom object which means we can't edit
        // // shapes once we change local state. instead, fetch the leaflet element and manually update its state,
        // // then set the button as is-active...
        this.polygonElement.leafletElement.properties = {...this.polygonElement.leafletElement.properties, colour: colour};
        this.polygonElement.leafletElement.setStyle(style);
        this.savePolygon();
    }

    render() {
        const coords = this.props.feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);

        const polygonClicked = event => {
            return false;
        };

        const setPopupButtonClass = () => {
            const popup = document.querySelector('.m-color-picker');
            const currentButton = popup.querySelector('button.is-current');

            if( currentButton ) {
                currentButton.classList.remove('is-current');
            }

            popup.querySelector(`button.${this.polygonElement.leafletElement.properties.colour}`).classList.add('is-current');
        };

        const popup = <Popup autoClose={true} closeOnClick={false} autoOpen={false} ref={this.popupRef} onOpen={setPopupButtonClass}>
            <div className="m-color-picker" feature={this.props.feature}>
                <button onClick={this.setColour.bind(this)} className={'black'} data-colour='black'>Black</button>
                <button onClick={this.setColour.bind(this)} className={'blue'} data-colour='blue'>Blue</button>
                <button onClick={this.setColour.bind(this)} className={'blue-hatched'} data-colour='blue-hatched'>Blue hatched</button>
                <button onClick={this.setColour.bind(this)} className={'red-soft'} data-colour='red-soft'>Soft red</button>
                <button onClick={this.setColour.bind(this)} className={'red-hatched'} data-colour='red-hatched'>Red hatched</button>
                <button onClick={this.setColour.bind(this)} className={'red'} data-colour='red'>Red</button>
                <button onClick={this.setColour.bind(this)} className={'yellow'} data-colour='yellow'>Yellow</button>
                <button onClick={this.setColour.bind(this)} className={'yellow-hatched'} data-colour='yellow-hatched'>Yellow hatched</button>
                <button onClick={this.setColour.bind(this)} className={'unknown'} data-colour='unknown'>Too difficult to tell</button>
            </div>
        </Popup>;

        const style = getStyle(this.props.feature.properties.colour);

        return <Polygon onClick={polygonClicked} positions={coords} ref={this.polygonRef} {...style}>
            {popup}
        </Polygon>;
    }
}
