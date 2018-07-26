import React,{Component} from 'react';
import {observer, inject} from "mobx-react";
import PropTypes from 'prop-types';
import { NavLink, Link, withRouter } from 'react-router-dom';
import Img from 'react-image';

@inject('userPresent', 'mapViewStore', 'trayViewStore')
@withRouter
@observer export default class Tools extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    this.props.mapViewStore.overlay = event.target.dataset.overlay;
  }

  handleOnClickAddRecord(event) {
    this.props.mapViewStore.add_record_mode = true;

    if( this.props.trayViewStore.tray_is_visible ) {
      this.props.trayViewStore.toggleTrayVisibility();
    }
  }

  accountLink() {
      if (this.props.userPresent) {
          return <Link to="/map/account/account" data-label="Your profile"><span>Your profile</span></Link>
      } else {
          return <a data-label="Sign in" href="/users/sign_in?return_to=/map/account/account"><span>Sign in</span></a>
      }
  }

  createCollectionLink() {
      if (this.props.userPresent) {
          return <Link to='/map/collections/new' data-label="Create collection"><span>Create collection</span></Link>
      } else {
          return <a data-label="Create collection" href="/users/sign_in?return_to=/map/collections/new"><span>Create collection</span></a>
      }
  }

  addRecordLink() {
      if (this.props.userPresent) {
          return <Link to='/map/choose-place' data-label="Add record"><span>Add record</span></Link>
      } else {
          return <a data-label="Add record" href="/users/sign_in?return_to=/map/choose-place"><span>Add record</span></a>
      }
  }

  render() {
    const logo = require('../assets/images/logo.svg');
    return <div className="m-sidebar">
        
      <div className="m-logo">
        <a href="/" title="Return to homepage">
          <Img src={logo} alt="Logo" loader={<span className="is-loading" /> }/>
        </a>
      </div>
      <div className="m-tools">
        <div className="m-tool-button m-tool-button--search">
          <Link to='/map/search' data-label="Search"><span>Search</span></Link>
        </div>
        <div className="m-tool-button m-tool-button--layers">
          <Link to='/map/layers' data-label="Layers"><span>Layers</span></Link>
        </div>
        <div className="m-tool-button m-tool-button--add-collection">
          {this.createCollectionLink()}
        </div>
        <div className="m-tool-button m-tool-button--add">
            {this.addRecordLink()}
        </div>
      </div>

        <div className="m-actions">
          <div className="m-tool-button m-tool-button--your-account">
              {this.accountLink()}
          </div>
        </div>

    </div>;
  }
}

// Tools.propTypes = {
//   mapViewStore: PropTypes.object.isRequired,
//   trayViewStore: PropTypes.object.isRequired
// };
