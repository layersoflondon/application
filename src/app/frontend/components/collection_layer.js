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
  componentWillReceiveProps(nextProps, nextContext) {
    const collection_id = parseInt(this.props.layer.layer_data.collection_id, 10);

    const cards = this.props.trayViewStore.cards.values().filter((card) => {
      const collection_ids = card.object.collection_ids || [];
      return collection_ids.indexOf(collection_id)>-1;
    });

    cards.map((card)=>card.opacity = nextProps.opacity);
  }

  render() {
    return <React.Fragment/>
  }
}
