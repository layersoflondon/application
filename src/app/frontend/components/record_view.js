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
    this.props.trayViewStore.record_id = this.props.match.params.id;
  }

  componentWillUnmount() {
    if( this.props.routing.location.pathname.search(/\/edit$/) > -1 ) {
    }else {
      this.props.trayViewStore.record_id = false;
      this.props.trayViewStore.record = false;
    }
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
            <Link className="close" to={link_path}>Close</Link>
          </div>

          <div className="wrap">
            <div className="m-record-hero">
              {this.props.trayViewStore.record.image && <div className="image random-image" style={{'backgroundImage': `url('${this.props.trayViewStore.record.image.primary}')`}}></div>}
            </div>

            <div className="meta">
              <div className="dates">
                <span className="date start-date">{this.props.trayViewStore.record.date_from}</span>
              </div>
              <div className="creator">Created by {this.props.trayViewStore.record.user.name}</div>
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
              {Parser(this.props.trayViewStore.record.description)}
            </div>

            <div className="attribution">
              <ul>
                <li><h4>Created:</h4> {this.props.trayViewStore.record.created_at}</li>
                {/*<li><h4>Credits:</h4> Curabitur eu euismod risus</li>*/}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  }

  render() {
    if( this.props.trayViewStore.record ) {
      return this[`render_state_loading_${this.props.trayViewStore.loading_record}`]();
    }else {
      return <span></span>
    }
  }
}
