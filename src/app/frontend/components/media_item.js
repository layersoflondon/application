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

  image() {
    console.log(`Showing image()`);
    return <img src={require('../assets/images/example/1-large.jpg')} alt=""/>
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
        <div className="m-media-viewer *m-media-viewer--basic">
          <div className="close">
            <Link to={`/map/records/${this.props.match.params.id}`}>Close</Link>
          </div>
            <div className="wrap">
              <div className="main-media-item">
                <div className="item">
                  {this.props.match.params.media_type && this[this.props.match.params.media_type]()}
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

              <div className="m-record-media-thumbs">
                <div className="controls">
                  <button className="scroll-left"></button>
                  <button className="scroll-right"></button>
                </div>
                <div className="pane">
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/1.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/4.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/5.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb thumb--audio thumb--portrait">
                    <Link to={`/map/records/${this.props.match.params.id}/media/2/soundcloud`}><img src={require('../assets/images/example/2.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb thumb--video">
                    <Link to={`/map/records/${this.props.match.params.id}/media/2/video`}><img src={require('../assets/images/example/3.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/7.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/8.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/9.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/10.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/11.jpg')} alt=""/></Link>
                  </div>
                  <div className="thumb image">
                    <Link to={`/map/records/${this.props.match.params.id}/media/1/image`}><img src={require('../assets/images/example/12.jpg')} alt=""/></Link>
                  </div>
                </div>
              </div>

            </div>
        </div>
      </div>
    </div>
  }
}
