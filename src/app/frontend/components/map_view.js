import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import MarkerContainer from './marker_container';

import {observer} from "mobx-react";
import LayerToolsContainer from './layer_tools_container';

@observer export default class MapView extends Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.setMapRef = element => {
      this.mapRef = element;
      this.props.trayViewStore.map_ref = this.mapRef;
    }
  }

  handleOnDragEnd() {
    console.log("DRAGGED");
  }

  handleOnZoomEnd() {
    console.log("ZOOMED");
  }

  handleOnClick(event) {
    this.props.mapViewStore.latlng = event.latlng;

    if( this.props.mapViewStore.add_record_mode ) {
      const {lat, lng} = event.latlng;
      this.props.recordFormStore.latlng = event.latlng;

      this.props.mapViewStore.overlay = "record_form";
    }
  }

  updateLoopLayer(event) {
    if( !this.props.layersStore.loop_layer_id ) return;

    const leafletElement = this.refs['clipped-tilelayer'].leafletElement;
    const container_position = leafletElement._container.closest('.m-map').getBoundingClientRect();

    window.leafletElement = leafletElement;

    const x = event.clientX - container_position.x;
    const y = event.clientY - container_position.y;

    this.refs['clipped-tilelayer'].leafletElement._container.style.clipPath = `circle(200px at ${x}px ${y}px)`
  }

  render() {
    const position = this.props.mapViewStore.center.toJS();
    const map_zoom = this.props.mapViewStore.zoom;

    let markers = [];

    if( this.props.trayViewStore.card_store ) {
      this.props.trayViewStore.card_store.cards.map((c) => {
        let key;
        if( c.is_collection ) {
          c.records.map((r)=> {
            key = `collection_${c.id}_record_${r.id}`;
            markers.push( <MarkerContainer key={key} position={r.position} card={r} cardComponent={c} trayViewStore={this.props.trayViewStore} /> )
          })
        }else {
          key = `record_${c.id}`;
          markers.push( <MarkerContainer key={key} position={c.position} card={c} cardComponent={c} trayViewStore={this.props.trayViewStore} /> )
        }
      });
    }

    const layers = <span className="tile-layers">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />

      {this.props.layersStore.activeLayers.map((layer, index) => {
        return <TileLayer key={layer.id} url={layer.url} attribution={layer.attribution} opacity={layer.opacity} zIndex={1000-index} />
      })}
    </span>;

    return <div className="m-map-area" onMouseMove={this.updateLoopLayer.bind(this)}>
      <div className="m-map">
        <Map center={position} zoom={map_zoom} ref={this.setMapRef} onDragEnd={this.handleOnDragEnd.bind(this)} onZoomEnd={this.handleOnZoomEnd.bind(this)} onClick={this.handleOnClick.bind(this)}>
          {layers}
          {this.props.layersStore.loop_layer && <TileLayer key={this.props.layersStore.loop_layer.id} url={this.props.layersStore.loop_layer.url} attribution={this.props.layersStore.loop_layer.attribution} opacity={this.props.layersStore.loop_layer.opacity} zIndex={1000+1} className="clipped-tilelayer" ref='clipped-tilelayer' />}

          {markers}
        </Map>
      </div>

      <LayerToolsContainer {...this.props} />
    </div>;
  }
}
