import React, {Component} from 'react';
import PropTypes from 'prop-types';
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

    console.log("Image", this.props.card.image);
  }

  handleOnClick(event) {
    event.preventDefault();
    this.props.mapViewStore.visible_record_id = this.props.card.id;
  }

  render() {
    const default_icon = new L.Icon({
      iconUrl: require('../assets/images/marker-icon.png'),
      iconRetinaUrl: require('../assets/images/marker-icon-2x.png')
    });

    const highlighted_icon = new L.Icon({
      iconUrl: require('../assets/images/highlighted-marker-icon.png'),
      iconRetinaUrl: require('../assets/images/highlighted-marker-icon-2x.png')
    });

    let icon = this.props.card.highlighted ? highlighted_icon : default_icon;

    const position = this.props.position;

    return <Marker position={position} icon={icon}>
      <Popup>
        <div onClick={this.handleOnClick.bind(this)}>
          <img src="http://placehold.it/200x100" alt=""/>
          <h1>
            {this.props.card.name}
          </h1>
          <p>
            {this.props.card.description}
          </p>
        </div>
      </Popup>
    </Marker>;
  }
}

MarkerContainer.propTypes = {
  card: PropTypes.object.isRequired
};