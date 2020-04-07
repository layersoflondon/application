import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import { Route } from 'react-router';
import {Switch, withRouter} from 'react-router-dom';
import Img from 'react-image';
import MediaElement from './media_element';
import {recordPageView} from "../config/data_layer";
import {getQueryStringValue} from '../helpers/modals';

@inject('router', 'trayViewStore', 'mapViewStore')
@withRouter
@observer export default class MediaItem extends Component {
  constructor(props) {
    super(props);

    const itemId = getQueryStringValue(this.props.router.location, 'media-item-id');
    this.state = {media_item: this.props.trayViewStore.record.get_attachment(itemId)};
  }

  componentWillReceiveProps() {
    const itemId = getQueryStringValue(this.props.router.location, 'media-item-id');
    this.setState({media_item: this.props.trayViewStore.record.get_attachment(itemId)});
  }

  image() {
    return <Img src={this.state.media_item.attachable.large} alt="" loader={<span className="is-loading" />}/>
  }

  audio() {
    const sources = [{src: this.state.media_item.attachable.url, type: this.state.media_item.attachable.content_type}], config = {}, tracks = {};

    return <MediaElement width='100%' height='100%' id='player' sources={sources} tracks={tracks} options={config} mediaType='audio' />
  }

  video() {
    return <iframe width="100%" height="100%" src={`//www.youtube.com/embed/${this.state.media_item.attachable.youtube_id}?rel=0`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
  }

  render() {
    if(!this.state.media_item) return <React.Fragment />;

    if( this.props.trayViewStore.record && this.props.mapViewStore.recordModal ) {
      const render_method = this.state.media_item.media_type;
      const in_gallery_view = this.props.trayViewStore.record.view_type === 'gallery';
      recordPageView(`${this.props.trayViewStore.record.title} - media/${this.state.media_item.id}`);
      
      return <div className={`main-media-item ${this.state.media_item.media_type}`}>
        <Switch location={this.props.location}>
          <Route exact={true}>
            <div>
              <div className="item">
                {this.state.media_item && this[render_method]()}
              </div>

              {in_gallery_view && (
                <div className="meta">
                  {this.state.media_item.credit && (
                    <div className="attribution">
                      <p dangerouslySetInnerHTML={{__html: this.state.media_item.credit}}></p>
                    </div>
                  )}

                  {this.state.media_item.caption && (
                    <div className="caption *is-expanded">
                      <div className="pane">
                        <p>
                          <span dangerouslySetInnerHTML={{__html: this.state.media_item.caption}}></span>
                        </p>
                      </div>

                      {this.state.media_item.caption.length > 50 && (
                        <button className="show-all">Read more</button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Route>
        </Switch>
      </div>
    }else {
      return <React.Fragment />
    }
  }
}
