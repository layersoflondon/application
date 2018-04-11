import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
    const position = [51.1, -0.11];// this.props.mapViewStore.center.toJS();
    const map_zoom = 9; //this.props.mapViewStore.zoom;

    let markers = [];

    this.props.trayViewStore.cardStore.cards.map((c) => {
      if( c.is_collection ) {
        c.records.map((r)=>{
          markers.push( <MarkerContainer key={r.id} position={r.position} card={c} /> )
        })
      }else {
        markers.push( <MarkerContainer key={c.id} position={c.position} card={c} /> )
      }
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

// MapView.propTypes = {
//   mapViewStore: PropTypes.object.isRequired
// };
