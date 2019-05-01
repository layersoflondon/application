import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";
import axios from 'axios';

@inject('trayViewStore')
@observer export default class CollectionLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    console.log(this.props.layer.is_visible);
    if( this.props.layer.is_visible) {
      this.props.trayViewStore.collection_id = this.props.layer.layer_data.collection_id;
    }
  }

  render() {
    return <React.Fragment/>
  }
}
