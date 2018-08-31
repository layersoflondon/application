import React,{Component} from 'react';
import Img from 'react-image';
import {observer} from "mobx-react";
import { Map, Marker, TileLayer } from 'react-leaflet'
import RecordViewComponentState from './record_view_component_state';
import {NavLink} from 'react-router-dom';

@observer class RecordViewSidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="sidebar">
      <div className="place">
        <div className="map" style={{backgroundImage: `url(https://maps.tilehosting.com/styles/basic/static/${this.props.trayViewStore.record.lng},${this.props.trayViewStore.record.lat},15/400x300.png?key=23hrAY6lilqs9xizcz03&markers=${this.props.trayViewStore.record.lng},${this.props.trayViewStore.record.lat})`}}>
        </div>

        <div className="text">{this.props.trayViewStore.record.lat}, {this.props.trayViewStore.record.lng}</div>
      </div>

      <div className="social">
        {/*<div className="add-to-collection">*/}
          {/*<button><span>Add</span></button>*/}
          {/*Add to collection*/}
        {/*</div>*/}

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
