import React, {Component} from 'react';
import { Marker, Popup } from 'react-leaflet'
import Icon from 'leaflet';
import {Leaflet} from 'react-leaflet';

export default class MarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const position = this.props.card.record.position;
    console.log(position);

    return <Marker position={position}>
      <Popup>
        <span>{this.props.card.name}</span>
      </Popup>
    </Marker>;
  }
}
