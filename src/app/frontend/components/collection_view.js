import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {inject, observer} from "mobx-react";
import Parser from 'html-react-parser';
import {Link, withRouter} from 'react-router-dom';

@inject('routing', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer export default class CollectionView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    console.log("CollectionView componentWillMount");
    this.props.trayViewStore.visible_collection_id = this.props.match.params.id;
  }

  componentWillUnmount() {
    this.props.trayViewStore.visible_collection_id = false;
    // this.props.trayViewStore.visible_record = false;
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
