import React from 'react';
import {Map, TileLayer, ZoomControl, GeoJSON} from 'react-leaflet';
import _ from 'leaflet-draw';
import {inject, observer} from 'mobx-react/index';
import {NavLink, withRouter} from 'react-router-dom';

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

      window.e = event;
      const centre = [event.lat, event.lng];
      this.props.mapToolsStore.setZoomAndCentre(18, centre)
    }
    window.theClick = event;
  }

  componentWillMount() {
    setTimeout(() => {
      this.initializeLeafletDrawingControlUI();
    }, 50);

    setTimeout(() => {
      this.props.mapToolsStore.setPolygons();
    }, 150);
  }

  initializeLeafletDrawingControlUI() {
    const editableItems = L.featureGroup().addTo(this.props.mapToolsStore.mapRef.leafletElement);
    const visibleItems = L.featureGroup().addTo(this.props.mapToolsStore.mapRef.leafletElement);

    const drawingControl = new L.Control.Draw({
      position: 'bottomleft',
      edit: {
        featureGroup: editableItems,
        poly: {
          allowIntersection: false,
          showArea: true,
          showLength: true
        },
        marker: false
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          guidelineDistance: 10,
          showLength: true
        },
        polyline: false,
        marker: false,
        circlemarker: false,
        rectangle: false,
        circle: false
      }
    });

    this.props.mapToolsStore.drawingControl = drawingControl;

    this.props.mapToolsStore.mapRef.leafletElement.editableItems = editableItems;
    this.props.mapToolsStore.mapRef.leafletElement.visibleItems = visibleItems;

    const squareId = () => {
      const locationId = this.props.location.pathname.match(/\/(\d+)/);
      return locationId.length > 1 ? parseInt(locationId[1], 10) : null;
    };

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      const data = layer.toGeoJSON();
      if (layer.toGeoJSON().geometry.type === "Point") {
        data.properties = {...data.properties, radius: layer.getRadius()}
      }

      this.props.mapToolsStore.createFeature(squareId(), data);
    });

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.EDITED, (event) => {
      event.layers.eachLayer((layer) => {
        const data = layer.toGeoJSON();

        if (layer.toGeoJSON().geometry.type === "Point") {
          data.properties = {...data.properties, radius: layer.getRadius()}
        }

        this.props.mapToolsStore.updateFeature(squareId(), layer.properties.id, data);
      });
    });

    this.props.mapToolsStore.mapRef.leafletElement.on(L.Draw.Event.DELETED, (event) => {
      event.layers.eachLayer((layer) => {
        this.props.mapToolsStore.deleteFeature(squareId(), layer.properties.id);
      });
    });

    return drawingControl;
  }

  gridOnEachFeature(feature,layer) {
    layer.on('click', (e) => {
      const feature = e.target.feature;
      if (feature.properties.id === null) return;
      if (this.props.mapToolsStore.squareId) return; // if we're editing a square, don't make squares clickable
      if (this.props.location.pathname.search(/\/squares\/\d+/) === -1) {
        this.props.history.push(`/maptools/squares/${feature.properties.id}`);

        const centre = feature.properties.centroid;
        this.props.mapToolsStore.setZoomAndCentre(18, centre)
      }
    });
  }


  render() {
    let draggingEnabled = true;
    let zoomingEnabled = true;


    return <React.Fragment>
      <div className="m-map-area" data-zoom={this.props.mapToolsStore.zoom}>
        <Map ref={this.setMapRef} zoomControl={false}
             center={this.props.mapToolsStore.centre.toJS()} zoom={this.props.mapToolsStore.zoom}
             dragging={draggingEnabled} touchZoom={zoomingEnabled} doubleClickZoom={zoomingEnabled}
             scrollWheelZoom={zoomingEnabled}>
          <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03"
                     attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"/>
          <TileLayer url="http://tiles.layersoflondon.org/booth/{z}/{x}/{y}.png"/>

          <GeoJSON data={this.props.mapToolsStore.squares} onEachFeature={this.gridOnEachFeature.bind(this)}/>
        </Map>
      </div>
    </React.Fragment>
  }
}