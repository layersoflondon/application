import React, {Component} from 'react';
import {observer} from "mobx-react";
import L from "leaflet";

@observer export default class PlaceMarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {

  }

  render() {
    const iconUrl = 'data:image/svg+xml+base64,' + btoa(this.props.place.svg);
    const default_icon = new L.Icon({
      iconUrl: iconUrl
    });

    return <div>place</div>;
  }
}
