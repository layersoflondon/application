import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import ErrorBoundary from './error_boundary';
import { Polygon, TileLayer } from 'react-leaflet';
import CollectionLayer from "./collection_layer";
import GeoJSONLayer from "./geojson_layer";

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapLayerGroup extends Component {
  constructor(props) {
    super(props);

    this.fetchLayer = this.fetchLayer.bind(this);
  }

  tileserverLayer(layer, index) {
    return <TileLayer key={`layer-${layer.id}`} url={layer.layer_data.url} opacity={layer.getOpacity} zIndex={1000-index} />
  }

  collectionLayer(layer, index) {
    return <CollectionLayer key={`layer-${layer.id}`} layer={layer} />
  }

  datasetLayer(layer, index) {
    return <GeoJSONLayer key={`layer-${layer.id}`} layer={layer} />
  }

  polygonLayer(layer, index) {
    return <Polygon key={`layer-${layer.id}`} positions={layer.layer_data.points} opacity={layer.getOpacity} fillOpacity={layer.getOpacity/2} zIndex={1000+index} />
  }

  fetchLayer(layer, index) {
    if( typeof this[`${layer.layer_type}Layer`] === 'function' ) {
      return this[`${layer.layer_type}Layer`](layer, index);
    }
  }

  render() {
    return <ErrorBoundary>
      <div>
        {this.props.layerGroup.visibleLayers.map((layer, index) => this.fetchLayer(layer, index))}
      </div>
    </ErrorBoundary>;
  }
}
