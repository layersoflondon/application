import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';

import RecordViewTitle from './record_view_title';
import RecordViewMeta from './record_view_meta';
import RecordViewSidebar from './record_view_sidebar';
import RecordViewGallery from './record_view_gallery';
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    const fetch_nearby_data = this.props.trayViewStore.cards.size === 0;
    this.props.trayViewStore.fetchRecord(this.props.match.params.id, fetch_nearby_data);
  }

  componentWillUnmount() {
    if( this.props.routing.location.pathname.search(/\/edit$/) > -1 ) {
    }else {
    }
  }

  render_state_expanded() {
    console.log(`RecordView render method = render_state_expanded`);

    return <div className="m-header">
      <RecordViewTitle {...this.props} />
      <RecordViewMeta {...this.props} />
      <RecordViewSidebar {...this.props} />
    </div>
  }

  render_state_expanded_with_hero() {
    console.log(`RecordView render method = render_state_expanded_with_hero`);

    // this.props.record.hero_image => {url: '....'}

    return <div className="m-header">
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />
      <RecordViewMeta {...this.props} />
    </div>
  }

  render_state_gallery() {
    console.log(`RecordView render method = render_state_gallery`);

    return <div className="m-header">
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />
      <RecordViewMeta {...this.props} />

      {this.props.gallery}
    </div>
  }

  render_state_gallery_with_hero() {
    console.log(`RecordView render method = render_state_gallery_with_hero`);

    // this.props.record.hero_image => {url: '....'}

    return <div className="m-header">
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />
      <RecordViewMeta {...this.props} />

      {this.props.gallery}
    </div>
  }

  render() {
    let method_name = `render_state_${this.props.trayViewStore.record.view_type}`;
    if( this.props.trayViewStore.record.has_media ) {
    }

    if( this.props.trayViewStore.record.has_hero_image ) {
      method_name += '_with_hero'
    }

    return this[method_name]();
  }
}

export default RecordViewComponentState.bindComponent(RecordViewHeader);
