import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import ErrorBoundary from './error_boundary';

import { Map, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapLayerGroup extends Component {
  constructor(props) {
    super(props);
  }

  tileserverLayer(layer) {
    return <TileLayer key={`layer-${layer.id}`} url={layer.layer_data.url} opacity={layer.opacity} zIndex={1000-this.props.layerIndex} />
  }

  render() {
    return <ErrorBoundary>
      <div>
        {this.props.layerGroup.activeLayers.map((layer) => this[`${layer.layer_type}Layer`](layer))}
      </div>
    </ErrorBoundary>;
  }
}
