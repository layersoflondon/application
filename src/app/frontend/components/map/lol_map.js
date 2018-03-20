import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import {observer} from "mobx-react";

import MapState from '../../stores/map_view_store';

@observer class LoLMap extends Component {
  constructor(props) {
    super(props);
  }

  dragged() {
    console.log("DRAGGED");
  }

  zoomed() {
    console.log("ZOOMED");
  }

  render() {
    // console.log(MapState.center.toJS, MapState.zoom);

    let position = MapState.center.toJS();
    let map_zoom = MapState.zoom;

    return <div id="lol-map-container">
      <Map center={position} zoom={map_zoom} ref='map' onDragEnd={this.dragged.bind(this)} onZoomEnd={this.zoomed.bind(this)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br />Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    </div>;
  }
}

export default LoLMap;
