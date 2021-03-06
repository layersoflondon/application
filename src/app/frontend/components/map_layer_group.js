import React, {Component} from 'react';
import {observer, inject} from "mobx-react";
import ErrorBoundary from './error_boundary';
import { TileLayer } from 'react-leaflet';
import CollectionLayer from "./collection_layer";
import VectorGridLayer from "./vector_grid_layer";
import VectorGridFeature from "./vector_grid_feature";

@inject('router', 'mapViewStore', 'trayViewStore', 'layersStore', 'recordFormStore')
@observer export default class MapLayerGroup extends Component {
  constructor(props) {
    super(props);

    this.fetchLayer = this.fetchLayer.bind(this);
  }

  tileserverLayer(layer, index) {
    return <TileLayer key={`layer-${layer.id}`} url={layer.layer_data.url} opacity={layer.getOpacity} zIndex={this.props.layerIndex - index} maxZoom={this.props.maxZoom} />
  }

  geojsonLayer(layer, index) {
    let feature;
    const vectorLayer = <VectorGridLayer key={`layer-${layer.id}`} layer={layer} layerIndex={this.props.layerIndex} index={index} opacity={layer.getOpacity} maxZoom={this.props.maxZoom} />;

    const handleFeatureClick = (event) => layer.highlightedFeature = null;
    if( layer.highlightedFeature ) {
      feature = <VectorGridFeature key={`layer-feature-${layer.id}`} {...layer.highlightedFeature} onClickHandler={()=>handleFeatureClick} />
    }

    return <React.Fragment key={`layer-group-${layer.id}`}>
      {vectorLayer}
      {feature}
    </React.Fragment>
  }

  collectionLayer(layer, index) {
    return <CollectionLayer key={`layer-${layer.id}`} layer={layer} opacity={layer.getOpacity} />
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
