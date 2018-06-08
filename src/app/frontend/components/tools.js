import React,{Component} from 'react';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import { NavLink, Link, withRouter } from 'react-router-dom';

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

  render() {
    const logo = require('../assets/images/logo.svg');

    return <div className="m-sidebar">
      <div className="m-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="m-tools">
        <div className="m-tool-button m-tool-button--search">
          <Link to='/map/search' data-label="Search"><span>Search</span></Link>
        </div>
        <div className="m-tool-button m-tool-button--layers">
          <Link to='/map/layers' data-label="Layers"><span>Layers</span></Link>
        </div>
        <div className="m-tool-button m-tool-button--add-collection">
          <Link to='/map/collections/new' data-label="Create collection"><span>Create collection</span></Link>
        </div>
        <div className="m-tool-button m-tool-button--add">
          <Link to='/map/records/new' data-label="Add record"><span>Add record</span></Link>
        </div>
      </div>
      <div className="m-actions">
        <div className="m-tool-button m-tool-button--your-account">
          <Link to="/map/account" data-label="Your profile"><span>Your profile</span></Link>
        </div>
      </div>
    </div>;
  }
}

Tools.propTypes = {
  mapViewStore: PropTypes.object.isRequired,
  trayViewStore: PropTypes.object.isRequired
};
