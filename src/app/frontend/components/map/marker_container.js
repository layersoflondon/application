import React, {Component} from 'react';
import {observer} from "mobx-react";
import { Marker, Popup } from 'react-leaflet'
import Icon from 'leaflet';
import {Leaflet} from 'react-leaflet';

import L from 'leaflet';

// import * as markerIcon from '../../assets/images/record-marker.svg';
// import * as highlightedMarkerIcon from '../../assets/images/record-marker-highlighted.svg';

@observer export default class MarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const default_icon = new L.Icon({
      iconUrl: require('../../assets/images/marker-icon.png'),
      iconRetinaUrl: require('../../assets/images/marker-icon-2x.png')
    });

    const highlighted_icon = new L.Icon({
      iconUrl: require('../../assets/images/highlighted-marker-icon.png'),
      iconRetinaUrl: require('../../assets/images/highlighted-marker-icon-2x.png')
    });

    let icon = this.props.card.highlighted ? highlighted_icon : default_icon;

    console.log(icon, position);
    // console.log(`Rendering MarkerContainer: ${this.props.card.highlighted}`);

    const position = this.props.card.record.position;

    return <Marker position={position} icon={icon}>
      <Popup>
        <span>{this.props.card.name}</span>
      </Popup>
    </Marker>;
  }
}
