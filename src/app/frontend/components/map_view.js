import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import MarkerContainer from './marker_container';

import {observer} from "mobx-react";
import RecordForm from "./forms/records/record_form";

@observer export default class MapView extends Component {
  constructor(props) {
    super(props);

    this.mapRef = null;
    this.setMapRef = element => {
      this.mapRef = element;
      this.props.mapViewStore.map_ref = this.mapRef;
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

  render() {
    const position = [51.55227613396215, 0.26617169380187999];// this.props.mapViewStore.center.toJS();
    const map_zoom = 14; //this.props.mapViewStore.zoom;

    let markers = [];

    this.props.trayViewStore.cardStore.cards.map((c) => {
      let key;
      if( c.is_collection ) {
        c.records.map((r)=> {
          key = `collection_${c.id}_record_${r.id}`;
          markers.push( <MarkerContainer key={key} position={r.position} card={c} trayViewStore={this.props.trayViewStore} /> )
        })
      }else {
        key = `record_${c.id}`;
        markers.push( <MarkerContainer key={key} position={c.position} card={c} trayViewStore={this.props.trayViewStore} /> )
      }
    });

    const layers = <span>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
    </span>;

    return <div className="m-map-area">
      <Map center={position} zoom={map_zoom} ref={this.setMapRef} onDragEnd={this.handleOnDragEnd.bind(this)} onZoomEnd={this.handleOnZoomEnd.bind(this)} onClick={this.handleOnClick.bind(this)}>
        {layers}

        {markers}
      </Map>
    </div>;
  }
}

// MapView.propTypes = {
//   mapViewStore: PropTypes.object.isRequired
// };
