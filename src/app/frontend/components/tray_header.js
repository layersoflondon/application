import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';
import pluralize from 'pluralize'

import {inject} from "mobx-react/index";

@inject('router', 'trayViewStore', 'mapViewStore')
@withRouter
@observer export default class TrayHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      introShowing: false
    }
  }

  componentWillUpdate() {
    this.content = this.props.trayViewStore.header_content;
  }

  componentWillMount() {
    this.content = this.props.trayViewStore.header_content;
  }

  closeTray() {
    if (typeof(this.props.closeAction) === 'function' ) {
      this.props.closeAction(this);
    } else {
      this.props.router.history.push('/map');
    }
  }

  toggleIntro() {
    this.setState({introShowing: !this.state.introShowing});
  }

  render() {
    const closeButton = <div className="close">
      <a className="close" onClick={this.closeTray.bind(this)}>Close</a>
    </div>;

    const introClassName = (this.state.introShowing) ? "is-showing" : "";

    const meta = <div className="meta">
      {this.content.tray_view_type}&nbsp;
      {!!this.props.trayViewStore.recordsCount && pluralize('record', this.props.trayViewStore.recordsCount, true)}
      {!!this.props.trayViewStore.collectionsCount && ` and ${pluralize('collection',this.props.trayViewStore.collectionsCount,true)}`}
    </div>;

    const trayHeader = <React.Fragment>
      <div className="m-tray-title-area">
        {closeButton}
        {
          this.content.profile_image_url &&
          <div className="profile-pic">
            <div className="image random-image" style={{backgroundImage: `url(${this.content.profile_image_url})`}}></div>
          </div>
        }
        {
          this.content.title &&
          <h1>{this.content.title}</h1>
        }

        {
          this.content.subtitle &&
          <h2>{this.content.subtitle}</h2>
        }

        {meta}

        {
          (this.content.creator_link_text && this.content.creator_link_url) &&
            <div className="creator-link">
              <Link to={this.content.creator_link_url}>{this.content.creator_link_text}</Link>
            </div>
        }
      </div>
      {
        this.content.introduction &&
        <div className={`m-tray-introduction ${introClassName}`}>
          <p dangerouslySetInnerHTML={{__html: this.content.introduction}}></p>
          <a onClick={this.toggleIntro.bind(this)}>{this.state.introShowing ? "Hide" : "Read more"}</a>

        </div>
      }
    </React.Fragment>;


    return (this.props.showTrayHeader) ? trayHeader : null;
  }
}

TrayHeader.propTypes = {
  trayViewStore: PropTypes.object.isRequired,
  showTrayHeader: PropTypes.bool.isRequired,
  // title: PropTypes.string.isRequired,
  // profile_image_url: PropTypes.string,
  // introduction: PropTypes.string,
  // creator_link_url: PropTypes.string,
  // creator_link_text: PropTypes.string,
  // closeAction: PropTypes.func,
  // mapViewStore: PropTypes.object.isRequired
};

TrayHeader.defaultProps = {
  showTrayHeader: true
};
