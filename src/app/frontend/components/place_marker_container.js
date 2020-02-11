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
    const iconUrl = 'data:image/svg+xml+base64,' + btoa(this.props.place.svg);
    const icon = new L.Icon({
      iconUrl: iconUrl
    });

    return <Marker position={this.props.place.position.toJS()} icon={icon}>
      <Popup>
        <div className="m-map-popover">
        </div>
      </Popup>
    </Marker>;
  }
}
