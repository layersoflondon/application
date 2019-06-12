import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import VectorGrid from 'react-leaflet-vectorgrid';

@observer export default class VectorGridLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.vectorRef = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if( this.vectorRef && this.vectorRef.current ) {
      this.vectorRef.current.leafletElement._container.style.opacity = nextProps.layer.getOpacity;
      this.vectorRef.current.leafletElement._container.style.zIndex = (nextProps.layerIndex -+nextProps.index);
    }
  }

  handleClick(event) {
    const latlng = event.latlng;
    const properties = event.layer.properties;
    const featureId = event.layer._leaflet_id;

    this.props.layer.highlightedFeature = null;
    this.props.layer.highlightedFeature = {latlng: latlng, properties: properties, featureId: featureId};
  }

  render() {
    const color = this.props.layer.layer_data.vector_layer_colour;
    console.log('Name: ' + this.props.layer.layer_data.feature_name);
    console.log('Color: ' + color);
    let options = {
      type: 'protobuf',
      key: `layer-${this.props.layer.id}`,
      zIndex: 1000-this.props.index,
      url: this.props.layer.layer_data.url,
      subdomains: '*',
      interactive: true,

      vectorTileLayerStyles: {
        [this.props.layer.layer_data.feature_name]: (properties, zoom) => {
      //TODO this needs to be an anonymous function taking (properties, zoom) so we can target zoom and set the weight of the line
          //if (zoom == 2) {weight = 4;}
          let weight = (zoom-10)*(zoom-10)/8 + 1;
          if (weight<1) {
            weight=1;
          }
          return {
            opacity: this.props.layer.opacity,
            fillOpacity: this.props.layer.opacity,
            fill: false,
            weight: weight,
            stroke: true,
            color: color,
          }
        }
      },
      ...this.state
    };

    return <VectorGrid {...options} ref={this.vectorRef} zIndex={this.props.layerIndex - this.props.index} onClick={this.handleClick.bind(this)} />
  }
}
