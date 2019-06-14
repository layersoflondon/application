import React,{Component} from 'react';
import Img from 'react-image';
import {observer, inject} from "mobx-react";
import { Map, Marker, TileLayer } from 'react-leaflet'
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';
@inject('mapboxStaticMapsKey', 'userPresent')
@observer class RecordViewSidebar extends Component {
  constructor(props) {
    super(props);
  }

  addToCollectionLink() {
    if (this.props.userPresent) {
      return <Link to={`/map/records/${this.props.trayViewStore.record.id}/add-to-collection`}>Add to collection</Link>
    } else {
      return <a href={`/users/sign_in?return_to=/map/records/${this.props.trayViewStore.record.id}/add-to-collection`}><span>Add to collection</span></a>
    }
  }

  render() {


    return <div className="sidebar">
      <div className="place">
        <div className="m-mini-map" style={{backgroundImage: `url(https://api.maptiler.com/maps/basic/static/${this.props.trayViewStore.record.lng},${this.props.trayViewStore.record.lat},14/280x280.png?key=${this.props.mapboxStaticMapsKey})`}}>
        </div>

        <div className="text">{this.props.trayViewStore.record.lat}, {this.props.trayViewStore.record.lng}</div>
      </div>

      <div className="social">
        <div className="add-to-collection">
          { this.addToCollectionLink() }
        </div>

        {/*<div className="social-status">*/}
          {/*<button className="like" onClick={() => this.props.trayViewStore.record.incrementLikeCount()}>*/}
            {/*<span>Like</span>*/}
          {/*</button>*/}
          {/*{this.props.trayViewStore.record.view_count} views <br/>*/}
          {/*{this.props.trayViewStore.record.like_count} likes*/}
        {/*</div>*/}

        {/*<div className="share-record">*/}
          {/*<button className="share"><span>Share</span></button>*/}
          {/*Share this record*/}
        {/*</div>*/}
      </div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewSidebar);
