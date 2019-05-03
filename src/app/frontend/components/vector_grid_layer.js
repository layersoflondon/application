import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import VectorGrid from 'react-leaflet-vectorgrid';

@observer export default class VectorGridLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.vectorRef = React.createRef();
  }

  render() {
    if( this.vectorRef && this.vectorRef.current ) {
      this.vectorRef.current.leafletElement.setOpacity(this.props.layer.getOpacity);
    }

    let options = {
      type: 'protobuf',
      key: `layer-${this.props.layer.id}`,
      zIndex: 1000-this.props.index,
      url: this.props.layer.layer_data.url,
      styles: {},
      subdomains: '*',

      vectorTileLayerStyles: {
        opacity: this.props.layer.getOpacity,
        fill: true,
        fillOpacity: this.props.layer.getOpacity,
        fillColor: '#c41312',
      }
    };

    return <VectorGrid {...options} ref={this.vectorRef} fillOpacity={this.props.layer.getOpacity} opacity={this.props.layer.getOpacity} />
  }
}
