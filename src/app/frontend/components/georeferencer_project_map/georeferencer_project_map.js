import {Component} from "react";
import {Map, Marker, Popup, TileLayer, ZoomControl} from 'react-leaflet';
import React from "react";
import ProjectMapMarker from "./project_map_marker";

export default class GeoreferencerProjectMap extends Component {

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.setMapRef = element => {
      this.mapRef = element;
    };


  }

  render() {

    let markers = [];


    if( this.props.images.length ) {
      this.props.images.map((c) => {
        markers.push( <ProjectMapMarker image={c} key={c.id}/> )
      });
    }


    return <div className="georeferencer-project-map">
      <Map ref={this.setMapRef} center={this.props.centroid} zoom={13}>
        <ZoomControl position={`bottomright`} />

        <TileLayer url="https://maps.tilehosting.com/styles/basic/{z}/{x}/{y}.png?key=23hrAY6lilqs9xizcz03" attribution="&copy; Maptiler and <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" zIndex={0} opacity={100} />

        {markers}

      </Map>
    </div>

  }
}