import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import MarkerContainer from './marker_container';

import {observer} from "mobx-react";

@observer export default class MapView extends Component {
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
    const position = this.props.mapViewStore.center.toJS();
    const map_zoom = this.props.mapViewStore.zoom;

    const markers = this.props.cardStore.cards.map( (c) => {
      return <MarkerContainer key={c.id} card={c} />;
    });

    const layers = <span>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
    </span>;

    return <div className="m-map-area" id="lol-map-container">
      <Map center={position} zoom={map_zoom} ref='map' onDragEnd={this.dragged.bind(this)} onZoomEnd={this.zoomed.bind(this)}>
        {layers}

        {markers}
      </Map>
    </div>;
  }
}
