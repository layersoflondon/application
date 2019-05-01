import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import { GeoJSON } from 'react-leaflet';
import axios from 'axios';

@inject('trayViewStore')
@observer export default class GeoJSONLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const state = {...this.state};

    this.props.layer.is_loading = true;
    console.log("Fetching", this.props.layer.data.url);
    axios.get(this.props.layer.data.url).then((response) => {
      this.props.layer.is_loading = false;
      state.data = response.data;

    }).finally(() => this.setState(state));
  }

  render() {
    if( this.props.layer.is_loading ) {
      return <React.Fragment/>
    }

    return <GeoJSON key={`layer-${this.props.layer.id}`} data={this.state.data} style={{
      "color": "#f00",
      "weight": 0,
      "opacity": 0.9,
      "fillOpacity": 1
    }}/>
  }
}
