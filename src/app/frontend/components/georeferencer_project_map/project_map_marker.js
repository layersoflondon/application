import React, {Component} from 'react';
import { Marker, Popup } from 'react-leaflet'

import {Leaflet} from 'react-leaflet';
import LeafletDataIcon from '../leaflet_data_icon';

export default class ProjectMapMarker extends Component {
  constructor(props) {
    super(props);

    this.state = {marker_hovered: false};
  }

  handleOnClick(event) {
    event.preventDefault();
    window.location = this.props.image.url
  }

  render() {
    const trackingMarker = `${this.props.image.id}`;

    const icon = new LeafletDataIcon({
      iconUrl: require('../../assets/images/record-marker.png'),
      iconRetinaUrl: require('../../assets/images/record-marker@2x.png'),

      iconSize: [30, 40],
      shadowSize: [0, 0],
      iconAnchor: [15, 20],
      popupAnchor: [0, -33],
      trackingMarker: trackingMarker
    });

    return <Marker position={this.props.image.centroid} icon={icon}>

      <Popup>

        <div className="m-map-popover placeholder-0" onClick={this.handleOnClick.bind(this)}>
          <div className={`m-record-card`}>
            <div className="wrapper">
              <div className="georeferencer-cta">
                This image needs adding to our layers!
                <button>Add to the layer now</button>
              </div>
            </div>
          </div>
        </div>

      </Popup>
    </Marker>;
  }
}
