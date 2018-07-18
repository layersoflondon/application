import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import { Route } from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';

@inject('routing', 'trayViewStore')
@withRouter
@observer export default class MediaView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps() {
    console.log("MediaView componentWillReceiveProps", arguments);
  }

  render() {
    const media_list = this.props.trayViewStore.record.media.map((media) => {
      return <div key={media.id} className="thumb image">
        <Link to={`/map/records/${this.props.match.params.id}/media/${media.id}`}>
          <img src={media.attachable.card} alt=""/>
        </Link>
      </div>;
    });

    return <Router>
      <Route render={( {location} ) => console.log(location) || (
        <TransitionGroup>
          <CSSTransition timeout={3000} classNames={'media-item'} key={location.key} >
            <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0, border: '2px solid red'}}>
              <div className="s-overlay--media is-showing">
                <div className="m-media-viewer *m-media-viewer--basic">
                  <div className="close">
                    <Link to={`/map/records/${this.props.match.params.id}`}>Close</Link>
                  </div>
                  <div className="wrap">
                    {this.props.children}

                    <div className="m-media-viewer-thumbs">
                      <div className="controls">
                        <button className="scroll-left"></button>
                        <button className="scroll-right"></button>
                      </div>
                      <div className="pane">

                        {media_list}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      )} />
    </Router>
  }
}
