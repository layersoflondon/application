import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {NavLink, Link, withRouter} from 'react-router-dom';
import { Route } from 'react-router';
import Img from 'react-image';

@inject('router', 'trayViewStore')
@withRouter
@observer export default class MediaView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps() {
    console.log("MediaView componentWillReceiveProps", arguments);
  }

  render() {
    const in_gallery_view = this.props.trayViewStore.record.view_type === 'gallery';

    const media_list = this.props.trayViewStore.record.media.map((media) => {
      return <div key={media.id} className="thumb image">
        <NavLink to={`/map/records/${this.props.match.params.id}/media/${media.id}`}>
          <Img src={media.attachable.card} alt="" loader={<span className="is-loading" /> }/>
        </NavLink>
      </div>;
    });

    return <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
      <div className="s-overlay--media is-showing">
        <div className="m-media-viewer *m-media-viewer--basic">
          <div className="close">
            <Link to={`/map/records/${this.props.match.params.id}`}>Close</Link>
          </div>

          <div className="wrap">

            {this.props.children}

            {in_gallery_view && (
              <div className="m-media-viewer-thumbs">
                <div className="controls">
                  <button className="scroll-left"></button>
                  <button className="scroll-right"></button>
                </div>
                <div className="pane">
                  {media_list}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  }
}
