import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import VectorGrid from 'react-leaflet-vectorgrid';
import {styleNames, getStyle} from '../helpers/styles';

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

        let weight = (zoom-10)*(zoom-10)/8 + 1;
        if (weight<1) {
          weight=1;
        }
        return {
          opacity: 0.6,
          fillOpacity: 0.5,
          fill: true,
          weight: weight,
          stroke: false,
          color: getStyle(styleName).fillColor,
        }
      }, r;
    },{});

    console.log("styles", styles);
    let options = {
      type: 'protobuf',
      url: "http://localhost:1234/{z}/{x}/{y}.pbf",
      key: `booth-polygons`,
      subdomains: '*',
      vectorTileLayerStyles: styles,
      zIndex: 1000
    };

    console.log("options",options);

    return <VectorGrid {...options} ref={this.vectorRef} />
  }
}
