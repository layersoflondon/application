import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerContainer from './marker_container';
import PlaceMarkerContainer from './place_marker_container';
import {observer, inject} from "mobx-react";
import {observe, toJS, observable} from 'mobx';
import LayerToolsContainer from './layer_tools_container';
import ErrorBoundary from './error_boundary';
import MapSearchContainer from './map_search_container';
import pluralize from "pluralize";
import MapLayerGroup from "./map_layer_group";
import {openModalLink} from '../helpers/modals';

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapView extends Component {
  constructor(props) {
    super(props);

    this.setMapRef = element => {
      this.props.mapViewStore.mapRef = element;
      this.props.trayViewStore.mapRef = element;
    };

    this.state = {headerShowing: false};

    observe(this.props.trayViewStore, 'tray_is_visible', (change) => {
      this.setState({headerShowing: (!change.newValue && !this.props.trayViewStore.root)});
    });

    observe(this.props.trayViewStore, 'root', (change) => {
      this.setState({headerShowing: (!change.newValue && !this.props.trayViewStore.tray_is_visible)});
    });
  }

  componentDidMount() {
    this.props.mapViewStore.getMapBounds().then((bounds) => {
      this.initial_bounds = bounds;
    });
  }

  handleOnDragEnd() {
    if(!this.props.trayViewStore.locked) {
      this.props.mapViewStore.getMapBounds().then((bounds) => {
        this.props.mapViewStore.center = observable([bounds.center.lat, bounds.center.lng]);
        // this.props.router.push(`/map/${bounds.center.lat},${bounds.center.lng},${this.props.mapViewStore.mapZoom}`);
      });
    }
  }

  handleOnZoomEnd(event) {
    if(!this.props.trayViewStore.locked) {
      this.props.mapViewStore.getMapBounds().then((bounds) => {
        this.props.mapViewStore.zoom = bounds.zoom;
        this.props.mapViewStore.center = observable([bounds.center.lat, bounds.center.lng]);
        // this.props.router.push(`/map/${bounds.center.lat},${bounds.center.lng},${bounds.zoom}`);
      });
    }



  }

  handleOnClick(event) {
    this.props.mapViewStore.latlng = event.latlng;

    if( this.props.mapViewStore.inChoosePlaceMode ) {
      const {lat, lng} = event.latlng;

      this.props.recordFormStore.latlng = event.latlng;
      this.props.recordFormStore.record.lat = lat;
      this.props.recordFormStore.record.lng = lng;

      this.props.mapViewStore.inChoosePlaceMode = false;
      this.props.mapViewStore.inEditRecordMode = true;

      if (!!this.props.recordFormStore.record.id) {
        // this.props.router.push(openModalLink(this.props.router.location, {key: 'editRecord', value: this.props.recordFormStore.record.id}));
      } else {
        this.props.router.push(openModalLink(this.props.router.location, {key: 'newRecord', value: true}, {remove: ['choose-place']}));
      }

    }
  }

  updateLoupeLayer(event) {
    if( !this.props.layersStore.loupe_layer_id ) return;

    const leafletElement = this.refs['clipped-tilelayer'].leafletElement;
    const container_position = leafletElement._container.closest('.m-map').getBoundingClientRect();

    window.leafletElement = leafletElement;

    const x = event.clientX - container_position.x;
    const y = event.clientY - container_position.y;

    this.refs['clipped-tilelayer'].leafletElement._container.style.clipPath = `circle(200px at ${x}px ${y}px)`
  }

  removeHeaderContent() {
    this.props.router.history.push('/map');
  }

  render() {
    const position = this.props.mapViewStore.center.map(i => i);

    const map_zoom = this.props.mapViewStore.zoom;

    let markers = [];
    
    this.props.trayViewStore.cardsToRenderOnMap.values().map((card, i) => {
      let key;


      markers.push( <ErrorBoundary key={`${card.id}_${i}`}><MarkerContainer position={card.data.position} record={card.data} cardComponent={card} trayViewStore={this.props.trayViewStore} isCollection={card.is_collection} /></ErrorBoundary> )
    });

    const layers = <span className="tile-layers">
      <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03" attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" maxZoom={this.props.mapViewStore.MAX_ZOOM} />
      {this.props.layersStore.activeVisibleLayerGroups.map((layerGroup, index) => {
        const layerGroupIndex = 100000-((index+1)*1000);
        return <MapLayerGroup key={layerGroup.id} layerGroup={layerGroup} layerIndex={layerGroupIndex} maxZoom={this.props.mapViewStore.MAX_ZOOM} />
      })}
    </span>;

    const places = <span className="tile-layers places">
      {this.props.mapViewStore.places.entries().map((placeEntry, index) => {
        return <PlaceMarkerContainer key={`place-result-${placeEntry[0]}-${index}`} place={placeEntry[1]} />
      })}
    </span>;

    // const headerContent = this.props.trayViewStore.header_content;
    const headerMeta = <div className="meta">
      {[
        // headerContent.tray_view_type,
        (!!this.props.trayViewStore.recordsCount && pluralize('record', this.props.trayViewStore.recordsCount, true)) || null,
        (!!this.props.trayViewStore.collectionsCount && pluralize('collection',this.props.trayViewStore.collectionsCount,true)) || null].filter((e) => {return e}).join(", ")}
    </div>;

    return <ErrorBoundary>
      <div className="m-map-area" onMouseMove={this.updateLoupeLayer.bind(this)}>
        <div className={`m-map ${this.props.mapViewStore.add_record_mode ? 'is-adding' : ''}`}>
          <Map center={position} zoom={map_zoom} ref={this.setMapRef} onDragEnd={this.handleOnDragEnd.bind(this)} onZoomEnd={this.handleOnZoomEnd.bind(this)} onClick={this.handleOnClick.bind(this)} zoomControl={false} >
            <ZoomControl position={`bottomright`} />

            <ErrorBoundary>
              <MapSearchContainer {...this.props} />
            </ErrorBoundary>

            {layers}
            {places}

            {this.props.layersStore.loupe_layer && <TileLayer key={this.props.layersStore.loupe_layer.id} url={this.props.layersStore.loupe_layer.url} attribution={this.props.layersStore.loupe_layer.attribution} opacity={this.props.layersStore.loupe_layer.opacity} zIndex={1000+1} className="clipped-tilelayer" ref='clipped-tilelayer' />}

            {!this.props.mapViewStore.lightsOut &&
              markers
            }
          </Map>
        </div>

        <LayerToolsContainer {...this.props} />
      </div>
    </ErrorBoundary>;
  }
}
