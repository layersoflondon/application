import React,{Component, Fragment} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {observer} from "mobx-react";
import {NavLink} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import RecordViewMediaList from './record_view_media_list';
import RecordViewComponentState from "./record_view_component_state";

import RecordViewHeader from './record_view_header';
import RecordViewContent from './record_view_content';
import RecordViewFooter from './record_view_footer';
import NotFound from '../not_found'

import {recordEvent, recordPageView} from "../../config/data_layer";

@observer class RecordView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    const fetch_nearby_data = this.props.trayViewStore.cards.size === 0;

    if( this.props.match.params.collection_id ) {
      this.props.trayViewStore.fetchCollectionAndRecord(this.props.match.params.collection_id, this.props.match.params.id);
    }else if( this.props.match.params.id ) {
      this.props.trayViewStore.fetchRecord(this.props.match.params.id, fetch_nearby_data);
    }
  }

  componentWillUnmount() {
    if( this.props.router.location.pathname.search(/\/edit$/) > -1 ) {
    }else {
    }
  }
  
  render() {
    if (this.props.trayViewStore.loading_error) {
      return <NotFound {...this.props} />
    }

    if( this.props.trayViewStore.record ) {
      if (this.props.router.location.pathname.search(/\/media/) === -1) {
        recordPageView(this.props.trayViewStore.record.title);
      }
      let header_classes = "m-record";
      let header_gallery_component = null;
      let content_gallery_component = null;

      if( this.props.trayViewStore.record.view_type === 'gallery' ) {
        header_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} numberOfItems={4} />;
      }else {
        content_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} />;
      }

      return(
        <Fragment>
          <Helmet>
            <title>{this.props.trayViewStore.record.title} | Layers of London | Recording the Layers of London's Rich Heritage</title>
            <meta name='description' content={`Read about ${this.props.trayViewStore.record.title} and thousands of other fascinating records on Layers of London. Add your own records, and help us build more layers.`}/>
            <meta name='keywords' content={`${this.props.trayViewStore.record.title}, layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`} />
            <link rel='canonical' href={`${window.location.protocol}//${window.location.host}/map/records/${this.props.trayViewStore.record.id}`} />
          </Helmet>

          <div className="m-overlay is-showing">
            <div className="s-overlay--record is-showing">
              <div className={header_classes}>

                <div className="close">
                  <a href="#" className="close" onClick={this.handleCloseOnClick}>Close</a>
                </div>

                <div className="wrap">
                  <RecordViewHeader  {...this.props} gallery={header_gallery_component} />
                  <RecordViewContent {...this.props} gallery={content_gallery_component} />
                  <RecordViewFooter  {...this.props} />

                  {this.props.children}
                </div>

              </div>
            </div>
          </div>
        </Fragment>

        );
    }else {
      return <span></span>
    }
  }
}

export default RecordViewComponentState.bindComponent(RecordView);
