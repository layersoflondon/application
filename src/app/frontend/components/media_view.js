import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {NavLink, Link, withRouter} from 'react-router-dom';
import Img from 'react-image';
import {appendQueryString} from '../helpers/modals';

@inject('router', 'trayViewStore', 'mapViewStore')
@withRouter
@observer export default class MediaView extends Component {
  constructor(props) {
    super(props);

    this.scrollingPaneRef = React.createRef();
  }

  componentWillUpdate() {
    if(this.scrollingPaneRef.current) {
      this.scrollingPaneRef.current.scrollLeft = this.scrollingPaneRef.current.querySelector('.active');
    }
  }

  scrollThumbs(event) {
    let scroll_by = 150;
    if( event.target.dataset.direction === "left" ) {
      scroll_by = -150;
    }

    this.scrollingPaneRef.current.scrollLeft += scroll_by;
  }

  render() {
    if(!this.props.trayViewStore.record || !this.props.mapViewStore.mediaModal) return <React.Fragment />

    const in_gallery_view = this.props.trayViewStore.record.view_type === 'gallery';
    const media_list = this.props.trayViewStore.record.media_and_videos.map((media) => {
      const classes = media.attachable.content_type.split('/').join(' ');
      const path = appendQueryString(this.props.router.location, [{key: 'media-item-id', value: media.id}])
      return <div key={media.id} className={`thumb ${classes}`}>
        <NavLink to={`?${path}`}>
          <Img src={media.attachable.thumb} alt="" loader={<span className="is-loading" /> }/>
        </NavLink>
      </div>;
    });

    const link = this.props.match.params.collection_id ? `/map/collections/${this.props.match.params.collection_id}/records/${this.props.match.params.id}` : `/map/records/${this.props.match.params.id}`;

    return <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
      <div className="s-overlay--media is-showing">
        <div className="m-media-viewer *m-media-viewer--basic">
          <div className="close">
            <Link to={link}>Close</Link>
          </div>

          <div className="wrap">

            {this.props.children}

            {in_gallery_view && (
              <div className="m-media-viewer-thumbs">
                <div className="controls">
                  <button className="scroll-left" onClick={this.scrollThumbs.bind(this)} data-direction="left"></button>
                  <button className="scroll-right" onClick={this.scrollThumbs.bind(this)} data-direction="right"></button>
                </div>
                <div className="pane" ref={this.scrollingPaneRef}>
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
