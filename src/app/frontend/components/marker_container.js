import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from "mobx-react";
import { Marker, Popup } from 'react-leaflet'
import {Link, withRouter} from 'react-router-dom';

import {Leaflet} from 'react-leaflet';
import L from 'leaflet';
import Parser from 'html-react-parser';
@inject('routing')
@withRouter
@observer export default class MarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    event.preventDefault();
    this.props.history.push(`/map/records/${this.props.record.id}`);
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
    const parsed_content = Parser(this.props.record.description);

    console.log(this.props.record);
    return <Marker position={this.props.position} icon={icon} onMouseOver={()=>this.props.record.highlighted = true} onMouseOut={()=>this.props.record.highlighted = false}>

      <Popup>

        <div className="m-map-popover" onClick={this.handleOnClick.bind(this)}>
          <div className="m-record-card">
            <div className="wrapper">
                {this.props.record.image &&
                <div className="image" style={{'backgroundImage': 'url(' + this.props.record.image.marker + ')'}}>
                </div>
                }

              <div className="text-content">
                <h1>{this.props.record.title}</h1>
              </div>
            </div>
          </div>
        </div>

      </Popup>
    </Marker>;
  }
}

MarkerContainer.propTypes = {
  record: PropTypes.object.isRequired
};
