import React from 'react';

import {Map, TileLayer, GeoJSON, FeatureGroup, Polygon} from 'react-leaflet';
import {EditControl} from "react-leaflet-draw";
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PolygonContainer from './polygon_container';
import PolygonVectorLayer from "./polygon_vector_layer";
import {getStyle} from '../helpers/styles';

@inject('mapToolsStore', 'userSession')
@withRouter
@observer
export default class MapView extends React.Component {
  constructor(props) {
    super(props);

    this.setMapRef = element => {
      this.props.mapToolsStore.mapRef = element;
    };

    this.setFeatureGroupRef = element => {
      this.props.mapToolsStore.editableFeatureGroup = element;
    };

    this.setEditControlRef = element => {
      this.props.mapToolsStore.editControl = element;
    };
  }

  handleOnClick(event) {
    if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
      // determine which square we need to render from the lat/lng of the click
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      const coords = this.props.mapToolsStore.squareCoordinates;
      const squares = coords.filter((coord) => {
        const nwLat = coord.nw[0];
        const nwLng = coord.nw[1];
        const seLat = coord.se[0];
        const seLng = coord.se[1];

        if (lat < nwLat && lat > seLat && lng > nwLng && lng < seLng) {
          return true
        }

      });

      const squareId = squares[0].id;

      this.props.history.push(`/maptools/squares/${squareId}`);

    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.props.mapToolsStore.setPolygons();
    }, 150);
  }
  

  squareStyle(feature) {
    // The masking square

    let checkedFillColor = "null";
    let checkedFillOpacity = 0;

    switch (feature.properties.state) {
      case "done":
        checkedFillColor = "#FFCF00";
        checkedFillOpacity = (this.props.mapToolsStore.mapRef.leafletElement.getZoom() <= 10) ? 0.3 : 0;
        break;
      case "verified":
        checkedFillColor = "#00FF0B";
        checkedFillOpacity = 0.2;
        break;
    }

    return {
      weight: (this.props.mapToolsStore.mapRef.leafletElement.getZoom() <= 10) ? 1 : 2,
      color: "#bf0000",
      fillOpacity: checkedFillOpacity,
      fillColor: checkedFillColor,
      className: "masking-square"
    }
  }

  gridOnEachFeature(feature, layer) {
    layer.on('click', (e) => {
      const feature = e.target.feature;
      if (feature.properties.id === null) return;
      if (this.props.mapToolsStore.squareId) return; // if we're editing a square, don't make squares clickable
      if (this.props.mapToolsStore.state === "done") return; // don't zoom into done squares
      if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
        this.props.history.push(`/maptools/squares/${feature.properties.id}`);

        this.props.mapToolsStore.setZoom(18)
      }
    });

  }

  gridStyle(feature) {
    let style = {
      weight: (this.props.mapToolsStore.mapRef.leafletElement.getZoom() <= 10) ? 1 : 2,
      color: "#ffffff",
      className: 'gridline'
    };


      //  determine the colour based on the state of the square
      let fillColor;
      let fillOpacity;
      switch (feature.properties.state) {
        case "not_started":
          fillColor = null;
          fillOpacity = 0;
          break;
        case "in_progress":
          fillColor = null;
          fillOpacity = 0;
          break;
        case "done":
          fillColor = "#FFCF00";
          fillOpacity = 0.3;
          break;
        case "verified":
          fillColor = "#00FF0B";
          fillOpacity = 0.2;
          break;
        case "flagged":

      }
      style.fillColor = fillColor;
      style.fillOpacity = fillOpacity;
      
    return style;
  }

  render() {
    let draggingEnabled = true;
    let zoomingEnabled = true;

    const polygons = this.props.mapToolsStore.editableFeatures.map((feature, i) => {
      return <PolygonContainer key={`editable-polygon-${i}`} feature={feature} mapToolsStore={this.props.mapToolsStore}/>;
    });

    const immutablePolygons = this.props.mapToolsStore.immutableFeatures.map((feature, i) => {
      const coords = feature.geometry.coordinates[0].toJS().map((lnglat) => [lnglat[1], lnglat[0]]);
      const style = getStyle(feature.properties.colour);
      return <Polygon key={`polygon-${i}`} positions={coords} {...style} />;
    });

    const isSignedIn = typeof this.props.userSession.id !== "undefined";

    const drawingControl = isSignedIn && this.props.mapToolsStore.atEditableSquare ? <FeatureGroup ref={this.setFeatureGroupRef}>

      <EditControl
        ref={this.setEditControlRef}
        position='bottomleft'
        onCreated={this.props.mapToolsStore.createdPolygon}
        onEdited={(event) => {
          this.props.mapToolsStore.editedPolygons(event);
        }}
        onDeleted={(event) => {
          this.props.mapToolsStore.deletedPolygons(event);
        }}
        // onDeleted={(event) => { console.log('deleted', event, event.layers)}}
        onEditResize={(event) => {
          this.props.mapToolsStore.editedPolygons(event);
        }}
        onEditMove={(event) => {
          this.props.mapToolsStore.editedPolygons(event);
        }}

        onEditStart={() => this.props.mapToolsStore.setEditingMode(true)}
        onEditStop={() => this.props.mapToolsStore.setEditingMode(false)}
        onDeleteStart={() => this.props.mapToolsStore.setDeleteMode(true)}
        onDeleteStop={() => this.props.mapToolsStore.setDeleteMode(false)}

        draw={{
          polygon: {
            allowIntersection: false,
            showArea: false,
            showLength: false,
            guideLineDistance: 10
          },
          polyline: false, marker: false, circlemarker: false, rectangle: false, circle: false
        }}
      />

      {polygons}
    </FeatureGroup> : null;

    return <React.Fragment>
      <div className="m-map-area" data-zoom={this.props.mapToolsStore.zoom}>
        <Map ref={this.setMapRef} zoomControl={true}
              center={this.props.mapToolsStore.centre.toJS()} zoom={this.props.mapToolsStore.zoom}
              dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled}
              scrollWheelZoom={zoomingEnabled} onClick={this.handleOnClick.bind(this)} key={this.props.mapToolsStore.square ? `maptools-square-${this.props.mapToolsStore.square.id}` : 'maptools-squares'}>
          <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=qyf8wWyodKCn5d8UagsY"
                      attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
          <TileLayer url="https://tiles.layersoflondon.org/booth/{z}/{x}/{y}.png"/>

          { !this.props.mapToolsStore.square &&
            <React.Fragment>
              <GeoJSON data={this.props.mapToolsStore.squares} style={this.gridStyle.bind(this)} />
                {/*<PolygonVectorLayer/>*/}
            </React.Fragment>
          }

          {this.props.mapToolsStore.square &&
            <React.Fragment>
              <GeoJSON data={this.props.mapToolsStore.square.geojson} style={this.squareStyle.bind(this)}/>
              {/*{this.props.mapToolsStore.showShapes &&*/}
              {/*  <PolygonVectorLayer/>*/}
              {/*}*/}
              {immutablePolygons}
            </React.Fragment>
          }

          {drawingControl}

        </Map>
      </div>
    </React.Fragment>
  }
}