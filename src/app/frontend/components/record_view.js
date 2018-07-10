import React,{Component} from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet'
import {inject, observer} from "mobx-react";
import Parser from 'html-react-parser';
import {Link, withRouter} from 'react-router-dom';

@inject('routing', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer export default class RecordView extends Component {
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
      this.props.trayViewStore.record_id = false;
      this.props.trayViewStore.record = false;
    }
  }

  componentWillReceiveProps(props) {
    console.log("Record view updated props: ", this.props.match.params, props.match.params);
  }

  handleCloseOnClick(event) {
    event.preventDefault();

    // if(this.props.routing.history.length>1) {
    //   this.props.routing.history.goBack();
    // }else {
    //   this.props.routing.push("/map");
    // }
    this.props.routing.push("/map");
  }

  render_full() {
    const link_path = this.props.match.params.collection_id ? `/map/collections/${this.props.match.params.collection_id}` : '/map';

    return <div>
      <div className="m-record-media">
        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src="https://via.placeholder.com/600x150/E8117F/000000?text=image" alt=""/></Link>
        </div>

        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/2/soundcloud`}><img src="https://via.placeholder.com/600x150/E8117F/000000?text=audio" alt=""/></Link>
        </div>

        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/2/video`}><img src="https://via.placeholder.com/600x150/E8117F/000000?text=video" alt=""/></Link>
        </div>
      </div>
      
      <div className="meta">
        <div className="dates">
          <span className="date start-date">{this.props.trayViewStore.record.date_from}</span>
        </div>
        <div className="creator">By {this.props.trayViewStore.record.user.name}</div>
      </div>

      <div className="social">
        <div className="social-status">
          <button className="like" onClick={() => this.props.trayViewStore.record.incrementLikeCount()}>
            <span>Like</span>
          </button>
          {this.props.trayViewStore.record.view_count} views <br/>
          {this.props.trayViewStore.record.like_count} likes
        </div>

        <div className="share-record">
          <button className="share"><span>Share</span></button>
          Share this record
        </div>
      </div>

      <div className="title">
        <h1>{this.props.trayViewStore.record.title}</h1>
      </div>

      <div className="sidebar">
        <div className="place">
          <div className="map">
            <Map center={this.props.trayViewStore.record.position} zoom={14}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
              <Marker position={this.props.trayViewStore.record.position} icon={this.props.trayViewStore.record.icon()} />
            </Map>
          </div>

          <div className="text">{this.props.trayViewStore.record.location.address} | {this.props.trayViewStore.record.lat}, {this.props.trayViewStore.record.lng}</div>
        </div>

        <div className="actions">
          <button className="add-to-collection">Add to collection</button>
          <button className="contact-owner">Contact owner</button>
          <button className="flag">Flag</button>
          <Link to={`${link_path}/records/${this.props.match.params.id}/edit`} className="edit">Edit</Link>
        </div>
      </div>

      <div className="m-article">
        {this.props.trayViewStore.record.description}
      </div>

      <div className="attribution">
        <ul>
          <li><h4>Created:</h4> {this.props.trayViewStore.record.created_at}</li>
          {
            this.props.trayViewStore.record.credit &&
            <li><h4>Credit:</h4> {this.props.trayViewStore.record.credit}</li>
          }
        </ul>
      </div>
    </div>
  }

  render_gallery() {
    const link_path = this.props.match.params.collection_id ? `/map/collections/${this.props.match.params.collection_id}` : '/map';

    return <div>
      <div className="m-record-media">
        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src="https://via.placeholder.com/150/E8117F/000000?text=image" alt=""/></Link>
        </div>

        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/2/soundcloud`}><img src="https://via.placeholder.com/150/E8117F/000000?text=audio" alt=""/></Link>
        </div>

        <div className="media-item image">
          <Link to={`/map/records/${this.props.match.params.id}/media/2/video`}><img src="https://via.placeholder.com/150/E8117F/000000?text=video" alt=""/></Link>
        </div>
      </div>
    </div>
  }

  render_state_loading_true() {
    return <div className="m-overlay is-loading">
      loading
    </div>
  }

  render_state_loading_false() {
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
            <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
          </div>

          <div style={{position: 'absolute', top: '40px', left: '40px', border: '1px solid red'}}>
            <Link to={`/map/records/${this.props.match.params.id}/gallery`}>Gallery</Link> / <Link to={`/map/records/${this.props.match.params.id}/full`}>Full</Link>
          </div>

          <div className="wrap">
            <div className="m-record-hero">
              {this.props.trayViewStore.record.image && <div className="image random-image" style={{'backgroundImage': `url('${this.props.trayViewStore.record.image.primary}')`}}></div>}
            </div>

            {this.props.match.params.view_type && this[`render_${this.props.match.params.view_type}`]()}
            {!this.props.match.params.view_type && this.render_full()}  {/* if we dont have a view type, render the full view by default */}
          </div>
        </div>
      </div>
    </div>
  }

  render() {
    if( this.props.trayViewStore.record ) {
      return <div className={`record-view-${this.props.match.params.view_type ? this.props.match.params.view_type : 'full'}`}>
        {this.props.children}
        {this[`render_state_loading_${this.props.trayViewStore.loading_record}`]()}
      </div>
    }else {
      return <span></span>
    }
  }
}
