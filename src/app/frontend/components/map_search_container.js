import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from 'react-router-dom';
import {ReactLeafletSearch} from 'react-leaflet-search';
import {Leaflet} from 'react-leaflet';
import L from "leaflet";
@inject('router', 'mapBounds')
@withRouter export default class MapSearchContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icon = new L.Icon({
      iconUrl: require('../assets/images/place-marker.png'),
      iconRetinaUrl: require('../assets/images/place-marker-2x.png'),

      iconSize: [15, 15],
      shadowSize: [0, 0],
      iconAnchor: [11, 20],
      popupAnchor: [0, -33]
    });

    return (

        <ReactLeafletSearch
          map={this.map}
          position="topright"
          inputPlaceholder="Find a place"
          showMarker={true}
          showPopup={false}
          markerIcon={icon}
          zoom={15}
          closeResultsOnClick={true}
          openSearchOnLoad={true}
          providerOptions={{region: 'gb'}}
          searchBounds={[
            [
              this.props.mapBounds.south_west.lat,
              this.props.mapBounds.south_west.lng,
            ],
            [
              this.props.mapBounds.north_east.lat,
              this.props.mapBounds.north_east.lng,
            ],
          ]
          }

        />

    )
  }
}