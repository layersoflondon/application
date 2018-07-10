import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';
import Parser from "html-react-parser";

@inject('routing', 'trayViewStore')
@withRouter
@observer export default class MediaItem extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("Media item params: ", this.props.match.params);
  }

  componentWillUnmount() {
    console.log("media item unmounting");
  }

  image() {
    console.log(`Showing image()`);
    return <img src="https://via.placeholder.com/850x400/cccccc/000000" alt=""/>
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
    return <div className="m-overlay is-showing" style={{zIndex: 12341234}}>
      <div className="s-overlay--media is-showing">
        <div className="m-media">
          <div className="close">
            <Link to={`/map/records/${this.props.match.params.id}`}>Close</Link>
          </div>

          <div className="m-record-media">
            <div className="media-item image">
              {this.props.match.params.media_type && this[this.props.match.params.media_type]()}
            </div>
          </div>

        </div>
      </div>
    </div>
  }
}
