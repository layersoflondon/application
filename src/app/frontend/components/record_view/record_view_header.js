import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';
import Img from 'react-image'

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
    if( this.props.router.location.pathname.search(/\/edit$/) > -1 ) {
    }else {
    }
  }

  render_state_expanded(header_class) {
    return <div className={header_class}>
      <div className='title-area'>
        <div className="text-content">
          <RecordViewMeta {...this.props} />
          <RecordViewTitle {...this.props} />
        </div>
        <RecordViewSidebar {...this.props} />
      </div>
    </div>
  }

  render_state_expanded_with_hero(header_class) {
    // this.props.record.hero_image => {url: '....'}

    console.log(this.props.trayViewStore.record.hero_image.primary);
    return <div className={header_class}>

      <div className="m-record-hero">
        <div className="image">
          {
            this.props.trayViewStore.record.hero_image.primary &&
            <Link to={`${this.props.match.url}/media/${this.props.media.id}`}>
              <Img src={this.props.trayViewStore.record.hero_image.primary} loader={<span className='is-loading'></span>} />
            </Link>
          }
        </div>
      </div>

      <div className='title-area'>
        <div className="text-content">
          <RecordViewMeta {...this.props} />
          <RecordViewTitle {...this.props} />
        </div>
        <RecordViewSidebar {...this.props} />
      </div>

    </div>
  }

  render_state_gallery(header_class) {
    return <div className={header_class}>
      <RecordViewMeta {...this.props} />
      <RecordViewTitle {...this.props} />
      <RecordViewSidebar {...this.props} />

      {this.props.gallery}
    </div>
  }

  hero_image() {
    const hero_image_media_item = this.props.trayViewStore.record.hero_image_media_item;

    if( hero_image_media_item ) {
      return <Link to={`${this.props.match.url}/media/${hero_image_media_item.id}`}>
        <Img src={this.props.trayViewStore.record.hero_image.primary} loader={<span className='is-loading'></span>} />
      </Link>
    }else {
      return <Img src={this.props.trayViewStore.record.hero_image.primary} loader={<span className='is-loading'></span>} />;
    }
  }

  render_state_gallery_with_hero(header_class) {
    // this.props.record.hero_image => {url: '....'}

    this.props.trayViewStore.record.hero_image_media_item;

    return <div className={header_class}>
      <div className="m-record-hero">
        <div className="image">
          {
            this.props.trayViewStore.record.hero_image.primary && this.hero_image()
          }
        </div>
      </div>

      <RecordViewMeta {...this.props} />
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
