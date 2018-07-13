import React,{Component} from 'react';
import {observer} from "mobx-react";
import { Map, Marker, TileLayer } from 'react-leaflet'
import RecordViewComponentState from './record_view_component_state';
import RecordViewGalleryMediaItem from "./record_view_gallery_media_item";

@observer class RecordViewSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>RecordViewSidebar</div>

    return <div className="sidebar">
      <div className="place">
        <div className="map">
          <Map center={this.props.trayViewStore.record.position} zoom={14}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" />
            <Marker position={this.props.trayViewStore.record.position} icon={this.props.trayViewStore.record.icon()} />
          </Map>
        </div>

        <div className="text">{this.props.trayViewStore.record.location.address} | {this.props.trayViewStore.record.lat}, {this.props.trayViewStore.record.lng}</div>
      </div>

      <div className="social">
        <div className="add-to-collection">
          <button><span>Add</span></button>
          Add to collection
        </div>

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
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewSidebar);
