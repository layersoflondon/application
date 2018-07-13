import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';

import RecordViewTitle from './record_view_title';
import RecordViewMeta from './record_view_meta';
import RecordViewAttribution from './record_view_attribution';
import RecordViewSidebar from './record_view_sidebar';
import RecordViewMediaList from './record_view_media_list';
import RecordViewComponentState from "./record_view_component_state";

import RecordViewHeader from './record_view_header';
import RecordViewContent from './record_view_content';

@observer class RecordView extends Component {
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

  render_state_loading_false_old() {
    const link_path = this.props.match.params.collection_id ? `/map/collections/${this.props.match.params.collection_id}` : '/map';

    return <div className="m-overlay is-showing">
      <div className="s-overlay--record is-showing">
        <div className="m-record">
          <div className="next">
            {/*<button className="next" onClick={() => this.props.trayViewStore.moveToNextCard()}>Next</button>*/}
          </div>
          <div className="previous">
            {/*<button className="previous" onClick={() => this.props.trayViewStore.moveToPreviousCard()}>Previous</button>*/}
          </div>
          <div className="close">
            <a href="#" className="close" onClick={this.handleCloseOnClick}>Close</a>
          </div>

          <div style={{position: 'absolute', top: '40px', left: '40px'}}>
            <Link to={`/map/records/${this.props.match.params.id}/gallery`}>Gallery</Link> <br /> <Link to={`/map/records/${this.props.match.params.id}/full`}>Full</Link>
            {this.props.match.params.view_type}
          </div>

          <div className="wrap">

            {this.props.match.params.view_type && this[`render_${this.props.match.params.view_type}_header`]()}
            {!this.props.match.params.view_type && this.render_full_header()}  {/* if we dont have a view type, render the full view by default */}

            <div className="m-article">
              {this.props.trayViewStore.record.description}
            </div>

            <div className="footer">
              <div className="attribution">
                <ul>
                  <li><h4>Created:</h4> {this.props.trayViewStore.record.created_at}</li>
                  {
                    this.props.trayViewStore.record.credit &&
                    <li><h4>Credit:</h4> {this.props.trayViewStore.record.credit}</li>
                  }
                </ul>
              </div>
              <div className="footer-actions">
                <button className="contact-owner">Contact owner</button>
                <button className="flag">Report this record</button>
                <Link to={`${link_path}/records/${this.props.match.params.id}/edit`} className="edit">Edit</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  }

  render() {
    if( this.props.trayViewStore.record ) {
      let header_classes = "m-record";
      let header_gallery_component = null;
      let content_gallery_component = null;

      if( this.props.trayViewStore.record.view_type === 'gallery' ) {
        header_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} />;
      }else {
        content_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} />;
      }

      return <div className="m-overlay is-showing">
        <div className="s-overlay--record is-showing">
          <div className={header_classes}>

            <div className="close">
              <a href="#" className="close" onClick={this.handleCloseOnClick}>Close</a>
            </div>

            <div className="wrap">
              <RecordViewHeader  {...this.props} gallery={header_gallery_component} />
              <RecordViewContent {...this.props} gallery={content_gallery_component} />

              {this.props.children}
            </div>

          </div>
        </div>
      </div>;
    }else {
      return <span></span>
    }
  }
}

export default RecordViewComponentState.bindComponent(RecordView);
