import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {inject, observer} from "mobx-react";
import Parser from 'html-react-parser';
import {Link, withRouter} from 'react-router-dom';

@inject('router', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer export default class CollectionView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    if( this.props.match && this.props.match.params.id && this.props.match.params.id === this.props.trayViewStore.collection_id ) {
    }else if( this.props.match.params.id !== "new" ) { // dont set collection_id if we're at /collections/new
      this.props.trayViewStore.collection_id = this.props.match.params.id;
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount...");
    this.props.trayViewStore.collection_id = null;
  }

  render_state_loading_true() {
    return <div></div>;
  }

  render_state_loading_false() {
    return <div></div>;
  }

  render() {
    return this[`render_state_loading_${this.props.trayViewStore.loading_collection}`]();
  }
}
