import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import VectorGrid from 'react-leaflet-vectorgrid';
import {styleNames, getStyle} from '../helpers/styles';
@inject('mapToolsStore')
@observer export default class PolygonVectorLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.vectorRef = React.createRef();
  }

  render() {
    window.stylenames = styleNames;
    const styles = styleNames.reduce((r,styleName) => {
      return r[styleName] = (properties, zoom) => {

        let opacity = 0.5;


        if (this.props.mapToolsStore.square && (properties.square_id === this.props.mapToolsStore.square.id || properties.adjacent_square_ids.includes(this.props.mapToolsStore.square.id))) {
          opacity = 0;
        }

        let weight = (zoom-10)*(zoom-10)/8 + 1;
        if (weight<1) {
          weight=1;
        }
        return {
          opacity: opacity,
          fillOpacity: opacity,
          fill: true,
          weight: weight,
          stroke: false,
          color: getStyle(styleName).fillColor,
        }
      }, r;
    },{});

    let options = {
      type: 'protobuf',
      url: window.__POLYGONS_URL,
      key: `booth-polygons`,
      subdomains: '*',
      vectorTileLayerStyles: styles,
      zIndex: 1000,
      interactive: false
    };


    return <VectorGrid {...options} ref={this.vectorRef} />
  }
}
