import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import ErrorBoundary from './error_boundary';

import { Map, Marker, Popup, Polygon, TileLayer, ZoomControl } from 'react-leaflet';

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapLayerGroup extends Component {
  constructor(props) {
    super(props);

    this.fetchLayer = this.fetchLayer.bind(this);
  }

  tileserverLayer(layer) {
    return <TileLayer key={`layer-${layer.id}`} url={layer.layer_data.url} opacity={layer.getOpacity} zIndex={1000-this.props.layerIndex} />
  }

  georeferenced_imageLayer(layer) {
  }

  datasetLayer(layer) {
  }

  polygonLayer(layer) {
    return <Polygon key={`layer-${layer.id}`} positions={layer.layer_data.points} opacity={layer.getOpacity} zIndex={1000-this.props.layerIndex} />
  }

  fetchLayer(layer) {
    if( typeof this[`${layer.layer_type}Layer`] === 'function' ) {
      return this[`${layer.layer_type}Layer`](layer);
    }
  }

  render() {
    return <ErrorBoundary>
      <div>
        {this.props.layerGroup.activeLayers.map((layer) => this.fetchLayer(layer))}
      </div>
    </ErrorBoundary>;
  }
}
