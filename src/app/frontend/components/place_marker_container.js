import React, {Component} from 'react';
import {observer} from "mobx-react";
import L from "leaflet";
import {Marker, Popup} from "react-leaflet";

@observer export default class PlaceMarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {

  }

  render() {
    const icon = new L.Icon({
      iconUrl: require('../assets/images/place-marker.png'),
      iconRetinaUrl: require('../assets/images/place-marker-2x.png'),

      iconSize: [15, 15],
      shadowSize: [0, 0],
      iconAnchor: [7, 20],
      popupAnchor: [0, -33]
    });

    return <Marker position={this.props.place.position.toJS()} icon={icon}>
      <Popup>
        <div className="m-map-popover" onClick={this.handleOnClick.bind(this)}>
          <div className={`m-record-card place-result`}>
            <div className="wrapper">
              <div className="text-content">
                <h1>{this.props.place.name}</h1>

                <span dangerouslySetInnerHTML={{__html: this.props.place.display_name}}></span>
              </div>
            </div>
          </div>
        </div>

      </Popup>
    </Marker>;
  }
}
