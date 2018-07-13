import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';

import RecordViewTitle from './record_view_title';
import RecordViewMeta from './record_view_meta';
import RecordViewSidebar from './record_view_sidebar';
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

  render_state_expanded(header_class) {
    console.log(`RecordView render method = render_state_expanded`);

    return <div className={header_class}>
      <RecordViewTitle {...this.props} />
      <RecordViewMeta {...this.props} />
      <RecordViewSidebar {...this.props} />
    </div>
  }

  render_state_expanded_with_hero(header_class) {
    console.log(`RecordView render method = render_state_expanded_with_hero`);

    // this.props.record.hero_image => {url: '....'}

    return <div className={header_class}>
      <div className="image" style={{'backgroundImage': `url('${this.props.trayViewStore.record.hero_image.url}')`}} />

      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />
      <RecordViewMeta {...this.props} />
    </div>
  }

  render_state_gallery(header_class) {
    console.log(`RecordView render method = render_state_gallery`);

    return <div className={header_class}>
      <RecordViewMeta {...this.props} />
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />

      {this.props.gallery}
    </div>
  }

  render_state_gallery_with_hero(header_class) {
    console.log(`RecordView render method = render_state_gallery_with_hero`);

    // this.props.record.hero_image => {url: '....'}

    return <div className={header_class}>

      <RecordViewMeta {...this.props} />
      <div className="image" style={{'backgroundImage': `url('${this.props.trayViewStore.record.hero_image.url}')`}} />
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />

      {this.props.gallery}
    </div>
  }

  /*
# Portrait thumbnails
Thumb images containers in the .m-media-viewer-thumbs and in .m-record-media-summary need .thumb--portrait class adding if the image is portrait.

# Classes on record .header
.header--no-hero if there’s no hero image
.header--no-media if there’s no media
.header--full if the expanded layout is used (we could rename full to expanded to avoid confusion)
.header--gallery if the gallery template is used

# Classes on .m-media-viewer (lightbox)
.m-media-viewer--expanded if the parent record is using expanded layout
   */
  render() {
    let header_class = `header header--${this.props.trayViewStore.record.view_type === 'gallery' ? 'gallery' : 'expanded'}`;
    let method_name = `render_state_${this.props.trayViewStore.record.view_type}`;

    if( this.props.trayViewStore.record.has_hero_image ) {
      method_name += '_with_hero';
    }

    if( this.props.trayViewStore.record.has_media ) {
      header_class += ' header--has-media';
    }else {
      header_class += ' header--no-media';
    }

    if( this.props.trayViewStore.record.has_hero_image ) {
      header_class += ' header--has-hero';
    }else {
      header_class += ' header--no-hero';
    }

    if( this.props.gallery ) {
      header_class += ' header--gallery';
    }

    return this[method_name](header_class);
  }
}

export default RecordViewComponentState.bindComponent(RecordViewHeader);
