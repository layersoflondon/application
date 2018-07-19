import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import { Route } from 'react-router';
import {Switch, withRouter} from 'react-router-dom';
import Img from 'react-image';

@inject('router', 'trayViewStore')
@withRouter
@observer export default class MediaItem extends Component {
  constructor(props) {
    super(props);

    this.state = {media_item: this.props.trayViewStore.record.get_attachment(this.props.match.params.media_item_id)};
  }

  componentWillReceiveProps() {
    console.log("MediaItem componentWillReceiveProps", arguments);
  }

  image() {
    return <Img src={this.state.media_item.attachable.large} alt="" loader={<span className="is-loading" />}/>
  }

  soundcloud() {
    console.log(`Showing soundcloud()`);
    return <iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/249483615&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
  }

  video() {
    console.log(`Showing video()`);
    return <iframe width="560" height="315" src="https://www.youtube.com/embed/_jn2bUFFzY8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  }

  render() {
    const render_method = this.state.media_item.media_type;

    return <div className="main-media-item">
      <Switch location={this.props.location}>
        <Route exact={true}>
          <div>
            <div className="item">
              {this.state.media_item && this[render_method]()}
            </div>
            <div className="meta">
              <div className="attribution">
                <p>Duis dapibus mollis erat ac.</p>
              </div>
              <div className="caption">
                <p>Proin ornare sapien in nunc fermentum euismod. Sed lectus purus, ornare vel faucibus volutpat, pharetra vitae nisl. Nunc metus neque, dictum sit amet risus eget, porttitor tincidunt purus. Fusce ultricies est sed vulputate fermentum. Nunc vel tristique orci. Proin dapibus…</p>
                <button className="show-all">Read more</button>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  }
}
