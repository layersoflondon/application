import React, {Component} from 'react';
import {observer,  inject} from "mobx-react";

@inject('trayViewStore')
@observer export default class CollectionLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentWillMount() {
  //   if( this.props.layer.is_visible) {
  //     this.props.trayViewStore.collection_ids = [this.props.layer.layer_data.collection_id];
  //   }
  // }

  render() {
    return <React.Fragment/>
  }
}
