import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import { Marker, Popup } from 'react-leaflet'
import {Leaflet} from 'react-leaflet';
import L from 'leaflet';

@observer export default class MarkerContainer extends Component {
  constructor(props) {
    super(props);

    console.log("Card", this.props);
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

    return <Marker position={this.props.position} icon={icon}>
      <Popup>
        <div onClick={this.handleOnClick.bind(this)}>
          <img src="http://placehold.it/200x100" alt=""/>
          <h1>
            {this.props.card.title}
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