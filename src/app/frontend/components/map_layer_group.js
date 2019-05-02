import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import ErrorBoundary from './error_boundary';
import { TileLayer } from 'react-leaflet';
import VectorGrid from 'react-leaflet-vectorgrid';
import CollectionLayer from "./collection_layer";
import VectorGridLayer from "./vector_grid_layer";

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapLayerGroup extends Component {
  constructor(props) {
    super(props);

    this.fetchLayer = this.fetchLayer.bind(this);
  }

  tileserverLayer(layer, index) {
    if( layer.layer_data.vector_tiles ) {
      return <VectorGridLayer key={`layer-${layer.id}`} layer={layer} index={index} />
    }else {
      return <TileLayer key={`layer-${layer.id}`} url={layer.layer_data.url} opacity={layer.getOpacity} zIndex={1000-index} />
    }
  }

  collectionLayer(layer, index) {
    return <CollectionLayer key={`layer-${layer.id}`} layer={layer} />
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
