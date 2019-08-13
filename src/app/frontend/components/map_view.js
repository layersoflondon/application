import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerContainer from './marker_container';
import {observer, inject} from "mobx-react";
import {observe} from 'mobx';
import LayerToolsContainer from './layer_tools_container';
import ErrorBoundary from './error_boundary';
import MapSearchContainer from './map_search_container';
import pluralize from "pluralize";
import MapLayerGroup from "./map_layer_group";

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapView extends Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.setMapRef = element => {
      this.mapRef = element;
      this.props.mapViewStore.map_ref = this.mapRef;
      this.props.trayViewStore.map_ref = this.mapRef;
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
    this.initial_bounds = this.props.mapViewStore.current_bounds;
  }

  handleOnDragEnd() {
    if(!this.props.trayViewStore.locked) {
      this.props.trayViewStore.reloadTrayDataForBounds(this.props.mapViewStore.current_bounds);
    }
  }

  handleOnZoomEnd() {
    if(!this.props.trayViewStore.locked) {
      this.props.trayViewStore.reloadTrayDataForBounds(this.props.mapViewStore.current_bounds);
    }
  }

  handleOnClick(event) {
    this.props.mapViewStore.latlng = event.latlng;

    if( this.props.mapViewStore.add_record_mode ) {
      const {lat, lng} = event.latlng;

      this.props.recordFormStore.latlng = event.latlng;
      this.props.recordFormStore.record.lat = lat;
      this.props.recordFormStore.record.lng = lng;
      if (!!this.props.recordFormStore.record.id) {
        this.props.router.push(`/map/records/${this.props.recordFormStore.record.id}/edit`)
      } else {
        this.props.router.push('/map/records/new');
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
    const position = this.props.mapViewStore.center.toJS();
    const map_zoom = this.props.mapViewStore.zoom;

    let markers = [];

    if( this.props.trayViewStore.cards.size ) {
      this.props.trayViewStore.cards.values().map((c) => {
        let key;
        if( c.is_collection ) {
          c.data.records.map((r)=> {
            key = `collection_${c.id}_record_${r.id}`;
            markers.push( <ErrorBoundary key={key}><MarkerContainer position={r.position} record={r} cardComponent={c} trayViewStore={this.props.trayViewStore} /></ErrorBoundary> )
          })
        }else {
          markers.push( <ErrorBoundary key={c.id}><MarkerContainer position={c.data.position} record={c.data} cardComponent={c} trayViewStore={this.props.trayViewStore} /></ErrorBoundary> )
        }
      });
    }

    const layers = <span className="tile-layers">
      <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03" attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />

      {this.props.layersStore.activeVisibleLayerGroups.map((layerGroup, index) => {
        const layerGroupIndex = 100000-((index+1)*1000);
        return <MapLayerGroup key={layerGroup.id} layerGroup={layerGroup} layerIndex={layerGroupIndex} />
      })}
    </span>;

    const headerContent = this.props.trayViewStore.header_content;
    const headerMeta = <div className="meta">
      {[
        headerContent.tray_view_type,
        (!!this.props.trayViewStore.recordsCount && pluralize('record', this.props.trayViewStore.recordsCount, true)) || null,
        (!!this.props.trayViewStore.collectionsCount && pluralize('collection',this.props.trayViewStore.collectionsCount,true)) || null].filter((e) => {return e}).join(", ")}
    </div>;

    return <ErrorBoundary>
      {
        this.state.headerShowing && !this.props.mapViewStore.add_record_mode && (
          <div className="m-map-view-title-area">
            { (headerContent.title) &&
              <h1>{headerContent.title}<span className="close"><a  className="close" onClick={this.removeHeaderContent.bind(this)}>Close</a></span></h1>
            }

            {
              (headerContent.subtitle) &&
                <h2>{headerContent.subtitle}</h2>
            }
            {headerMeta}
          </div>
        )
      }

      <div className="m-map-area" onMouseMove={this.updateLoupeLayer.bind(this)}>
        <div className={`m-map ${this.props.mapViewStore.add_record_mode ? 'is-adding' : ''}`}>
          <Map center={position} zoom={map_zoom} ref={this.setMapRef} onDragEnd={this.handleOnDragEnd.bind(this)} onZoomEnd={this.handleOnZoomEnd.bind(this)} onClick={this.handleOnClick.bind(this)} zoomControl={false} >
            <ZoomControl position={`bottomright`} />

            <ErrorBoundary>
              <MapSearchContainer {...this.props} />
            </ErrorBoundary>
            {layers}
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
