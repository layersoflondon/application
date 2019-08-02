import React from 'react';
import { Map, TileLayer, ZoomControl, GeoJSON, FeatureGroup, Popup, Polygon } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { inject, observer } from 'mobx-react';
import {  withRouter } from 'react-router-dom';
import PolygonContainer from './polygon_container';

@inject('mapToolsStore')
@withRouter
@observer
export default class MapView extends React.Component {
    constructor(props) {
        super(props);

        this.setMapRef = element => {
            this.props.mapToolsStore.mapRef = element;
        };
    }

    handleOnClick(event) {
        if( this.props.location.pathname.search(/\/squares\/\d+/) === -1 ) {
            this.props.history.push(`/maptools/squares/1`);

            const centre = [event.lat, event.lng];
            this.props.mapToolsStore.setZoomAndCentre(18, centre);
        }
    }

    componentWillMount() {
        this.props.mapToolsStore.setPolygons();
    }

    render() {
        let draggingEnabled = true;
        let zoomingEnabled  = true;

        const editableFeatures = this.props.mapToolsStore.featureData.values().filter((feature) => {
            return feature.properties.id && feature.properties.userCanEdit && this.props.mapToolsStore.squareId === feature.properties.square.id;
        });

        const polygons = editableFeatures.map((feature, i) => {
            return <PolygonContainer key={`editable-polygon-${i}`} feature={feature} mapToolsStore={this.props.mapToolsStore} />;
        });

        const immutableFeatures = this.props.mapToolsStore.featureData.values().filter((feature) => {
            return !feature.properties.userCanEdit || this.props.mapToolsStore.squareId !== feature.properties.square.id;
        });

        const immutablePolygons = immutableFeatures.map((feature, i) => {
            const coords = feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);
            return <Polygon key={`polygon-${i}`} positions={coords} />;
        });

        const drawingControl = this.props.mapToolsStore.isZoomed ? <FeatureGroup>
            <EditControl
                position='bottomleft'
                onCreated={this.props.mapToolsStore.createdPolygon}
                onEdited={this.props.mapToolsStore.editedPolygons}
                onDeleted={this.props.mapToolsStore.deletedPolygons}
                draw={{
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        showLength: true,
                        guideLineDistance: 10
                    },
                    polyline: false, marker: false, circlemarker: false, rectangle: false, circle: false
                }}
            />
            {polygons}
        </FeatureGroup> : null;

        return <React.Fragment>
            <div className="m-map-area" data-zoom={this.props.mapToolsStore.zoom}>
                <Map onClick={this.handleOnClick.bind(this)} ref={this.setMapRef} zoomControl={false} center={this.props.mapToolsStore.centre.toJS()} zoom={this.props.mapToolsStore.zoom} dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled} scrollWheelZoom={zoomingEnabled}>
                    <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03" attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
                    <TileLayer url="http://tiles.layersoflondon.org/booth/{z}/{x}/{y}.png" />

                    {drawingControl}
                    {immutablePolygons}
                </Map>
            </div>
        </React.Fragment>
    }
}