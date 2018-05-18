import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import MarkerContainer from './marker_container';

import {observer} from "mobx-react";

@observer export default class CollectionTrayView extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return <div>ok</div>
  }
}
