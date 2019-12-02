import React,{Component} from 'react';
import {observer, inject} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';
import {openModalLink} from '../../helpers/modals';

@inject('mapboxStaticMapsKey', 'userPresent')
@observer class RecordViewSidebar extends Component {
  constructor(props) {
    super(props);
  }

  addToCollectionLink() {
    const path = openModalLink(this.props.location, {key: 'addToCollection', value: true});

    if (this.props.userPresent) {
      return <Link to={path}>Add to collection</Link>
    } else {
      return <a href={`/users/sign_in?return_to=${path}`}><span>Add to collection</span></a>
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
