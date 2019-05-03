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
      console.log("setting ref");
      window.vec = this.vectorRef;
      this.vectorRef.current.leafletElement.setOpacity(this.props.layer.getOpacity);
    }

    let options = {
      type: 'protobuf',
      key: `layer-${this.props.layer.id}`,
      zIndex: 1000-this.props.index,
      url: this.props.layer.layer_data.url,
      subdomains: '*',

      vectorTileLayerStyles: {
        opacity: this.props.layer.getOpacity,
        fill: true,
        // fillOpacity: this.props.layer.getOpacity,
        // fillColor: 'red',
        stroke: false
      },
      // styles: {
      //   weight: 0.5,
      //   opacity: 0.1,
      //   color: '#ccc',
      //   fillColor: '#390870',
      //   fillOpacity: 0.1,
      //   fill: true,
      //   stroke: false,
      // }
    };

    return <VectorGrid {...options} ref={this.vectorRef} />
  }
}
