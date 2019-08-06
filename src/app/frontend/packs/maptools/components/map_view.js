import React from 'react';
import { Map, TileLayer, GeoJSON, FeatureGroup, Polygon } from 'react-leaflet';
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
    if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
      this.props.history.push(`/maptools/squares/1`);

      const centre = [event.lat, event.lng];
      this.props.mapToolsStore.setZoomAndCentre(18, centre)
    }
    window.theClick = event;
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.mapToolsStore.setPolygons();
    }, 150);
  }

  gridOnEachFeature(feature,layer) {
    layer.on('click', (e) => {
      const feature = e.target.feature;
      if (feature.properties.id === null) return;
      if (this.props.mapToolsStore.squareId) return; // if we're editing a square, don't make squares clickable
      if (this.props.mapToolsStore.state === "done") return; // don't zoom into done squares
      if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
        this.props.history.push(`/maptools/squares/${feature.properties.id}`);

        const centre = feature.properties.centroid;
        this.props.mapToolsStore.setZoomAndCentre(18, centre)
      }
    });

  }

  geoJsonStyle(feature) {
    let style = {
      weight: (this.props.mapToolsStore.mapRef.leafletElement.getZoom() <= 10) ? 1 : 2,
      color: "#999999"
    };

    //if the store has a square ID, we're editing a square. In which case we need to make all other squares grey
    if (feature.properties.id && feature.properties.id === this.props.mapToolsStore.squareId) {
      //this is the square we're working on
      style.weight = 5;
      style.color = "#4B9FFF"
    } else if (this.props.mapToolsStore.squareId !== null) {
      //we're working on a square but not this one
      style.fillOpacity = 0.8;
    } else {
    //  determine the colour based on the state of the square
      let fillColor;
      let fillOpacity;
      switch (feature.properties.state) {
        case "not_started":
          fillColor = null;
          fillOpacity = 0;
          break;
        case "in_progress":
          fillColor = "#ffb165";
          fillOpacity = 0.8;
          break;
        case "done":
          fillColor = "#40a35f";
          fillOpacity = 0.8;
          break;
        case "flagged":

      }

      style.fillColor = fillColor;
      style.fillOpacity = fillOpacity;
    }

    // otherwise if there's no square ID, we're choosing a square, in which case set the colour of the square by its status
    
    return style;
  }

  render() {
    let draggingEnabled = true;
    let zoomingEnabled = true;

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
        onEdited={(event) => {this.props.mapToolsStore.editedPolygons(event)}}
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
        <Map ref={this.setMapRef} zoomControl={false}
             center={this.props.mapToolsStore.centre.toJS()} zoom={this.props.mapToolsStore.zoom}
             dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled}
             scrollWheelZoom={zoomingEnabled}>
          <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03"
                     attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
          <TileLayer url="http://tiles.layersoflondon.org/booth/{z}/{x}/{y}.png"/>

          <GeoJSON data={this.props.mapToolsStore.squares} onEachFeature={this.gridOnEachFeature.bind(this)} style={this.geoJsonStyle.bind(this)}/>

          {drawingControl}
          {immutablePolygons}
        </Map>
      </div>
    </React.Fragment>
  }
}