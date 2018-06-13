import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import { Marker, Popup } from 'react-leaflet'

import {Leaflet} from 'react-leaflet';
import L from 'leaflet';
import Parser from 'html-react-parser';

@observer export default class MarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    event.preventDefault();
    this.props.trayViewStore.visible_record_id = this.props.card.id;
  }

  render() {
    const default_icon = new L.Icon({
      iconUrl: require('../assets/images/record-marker.png'),
      iconRetinaUrl: require('../assets/images/record-marker-x2.png'),

      iconSize: [22, 30],
      shadowSize: [0, 0],
      iconAnchor: [11, 20],
      popupAnchor: [0, -33]
    });

    const highlighted_icon = new L.Icon({
      iconUrl: require('../assets/images/record-marker-highlighted.png'),
      iconRetinaUrl: require('../assets/images/record-marker-x2-highlighted.png'),

      iconSize: [22, 30],
      shadowSize: [0, 0],
      iconAnchor: [11, 20],
      popupAnchor: [0, 0]
    });

    let icon = this.props.cardComponent.highlighted ? highlighted_icon : default_icon;
    const parsed_content = Parser(this.props.card.description);

    return <Marker position={this.props.position} icon={icon} onMouseOver={()=>this.props.card.highlighted = true} onMouseOut={()=>this.props.card.highlighted = false}>
      <Popup>

        <div className="m-map-popover" onClick={this.handleOnClick.bind(this)}>
          <div className="m-record-card">
            <div className="wrapper">
              <div className="image" style={{'backgroundImage': 'url('+this.props.card.thumb+')'}}>
              </div>

              <div className="text-content">
                <h1>{this.props.card.title}</h1>
              </div>
            </div>
          </div>
        </div>

      </Popup>
    </Marker>;
  }
}

MarkerContainer.propTypes = {
  card: PropTypes.object.isRequired
};
