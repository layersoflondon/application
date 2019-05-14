import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import VectorGrid from 'react-leaflet-vectorgrid';

@observer export default class VectorGridLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.vectorRef = React.createRef();
  }

  // componentDidMount() {
  //   const fetchDataLayerName = async ()=> {
  //     let getDataLayerName = new Promise((resolve, reject) => {
  //       let dataLayerName = false;
  //       let timer = setInterval(() => {
  //         if( this.vectorRef && this.vectorRef.current && this.vectorRef.current && this.vectorRef.current.leafletElement && Object.keys(this.vectorRef.current.leafletElement._dataLayerNames).length ){
  //           dataLayerName = Object.keys(this.vectorRef.current.leafletElement._dataLayerNames)[0];
  //
  //           console.log("GOT: ", dataLayerName);
  //           resolve(dataLayerName);
  //           clearInterval(timer);
  //         }
  //
  //       }, 250);
  //     });
  //     let dataLayerName = await getDataLayerName;
  //     this.setState({...this.state, vectorTileLayerStyles: {[dataLayerName]: {opacity: 1, color: this.props.layer.layer_data.vector_layer_colour}}});
  //
  //     setTimeout(() => {
  //       this.vectorRef.current.leafletElement.options.vectorTileLayerStyles[dataLayerName] = {weight: 2, color: this.props.layer.layer_data.vector_layer_colour};
  //       this.vectorRef.current.leafletElement.redraw();
  //     }, 100);
  //   };
  //
  //   fetchDataLayerName();
  // }

  render() {
    let options = {
      type: 'protobuf',
      key: `layer-${this.props.layer.id}`,
      zIndex: 1000-this.props.index,
      url: this.props.layer.layer_data.url,
      subdomains: '*',

      vectorTileLayerStyles: {
        opacity: this.props.layer.getOpacity,
        fill: true,
        stroke: false,
        [this.props.layer.layer_data.feature_name]: {
          color: this.props.layer.layer_data.vector_layer_colour
        }
      },
      ...this.state
    };

    console.log(options);

    return <VectorGrid {...options} ref={this.vectorRef} />
  }
}
