import React,{Component, Fragment} from 'react';
import {observer, inject} from "mobx-react";
import PropTypes from 'prop-types';
import { NavLink, Link, withRouter } from 'react-router-dom';
import Img from 'react-image';

@inject('userPresent', 'adminUserPresent', 'mapViewStore', 'trayViewStore', 'currentUser')
@withRouter
@observer export default class Tools extends Component {
  constructor(props) {
    super(props);

    this.state = {show_menu: false};
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

  handleHamburgerOnClick(event) {
    this.setState({show_menu: !this.state.show_menu});
  }

  accountLink() {
      if (this.props.currentUser && this.props.currentUser.token ) {
          return "";
      }

      if (this.props.userPresent) {
          return <Link to="/map/account/account" data-label="Your profile"><span>Your profile</span></Link>
      } else {
          return <a data-label="Sign in" href="/users/sign_in?return_to=/map/account/account"><span>Sign in</span></a>
      }
  }



  createCollectionLink() {
      if (this.props.userPresent) {
          return <Link to='/map/collections/new' data-label="Create collection" onClick={this.handleHamburgerOnClick.bind(this)}><span>Create collection</span></Link>
      } else {
          return <a data-label="Create collection" href="/users/sign_in?return_to=/map/collections/new"><span>Create collection</span></a>
      }
  }

  addRecordLink() {
      if (this.props.userPresent) {
          return <Link to='/map/choose-place' data-label="Add record" onClick={this.handleHamburgerOnClick.bind(this)}><span>Add record</span></Link>
      } else {
          return <a data-label="Add record" href="/users/sign_in?return_to=/map/choose-place"><span>Add record</span></a>
      }
  }

  render() {
      const logo = require('../assets/images/logo.svg');
      const errorLogo = require('../assets/images/errormadethis.svg');

      let button_class  = 'hamburger';
      let sidebar_class = 'm-sidebar';

      if( this.state.show_menu ) {
        button_class += ' is-active';
        sidebar_class   += ' menu-is-open';
      }

      return <Fragment>
          <div className={sidebar_class}>

              <div className="m-logo">
                  <a href="/" title="Return to homepage">
                      <img src={logo} alt="Logo" />
                  </a>
              </div>

              <div className="m-hamburger">
                  <button className={button_class} type="button" onClick={this.handleHamburgerOnClick.bind(this)}>
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span>
                        </span>
                  </button>
              </div>

              <div className="m-smartphone-menu-wrapper">
                  <div className="m-tools">
                      <div className="m-tool-button m-tool-button--search">
                          <Link to='/map/search' data-label="Search records" onClick={this.handleHamburgerOnClick.bind(this)}><span>Search records</span></Link>
                      </div>
                      <div className="m-tool-button m-tool-button--layers">
                          <Link to='/map/layers' data-label="Layers" onClick={this.handleHamburgerOnClick.bind(this)}><span>Layers</span></Link>
                      </div>
                    <div className="m-tool-button m-tool-button--collections">
                      <Link to='/map/search?results=true&collections=true' data-label="Collections" onClick={this.handleHamburgerOnClick.bind(this)}><span>Collections</span></Link>
                    </div>
                      <div className="m-tool-button m-tool-button--add-collection">
                          {this.createCollectionLink()}
                      </div>
                      <div className="m-tool-button m-tool-button--add">
                          {this.addRecordLink()}
                      </div>
                      <div className="m-tool-button m-tool-button--admin">
                        {
                          this.props.adminUserPresent &&
                          <a data-label="Admin" href="/admin"><span>Admin</span></a>
                        }
                      </div>
                  </div>

                  <div className="m-actions">
                    <div className="m-tool-button m-tool-button--your-records">
                      {
                        this.props.userPresent &&
                        <Link to={`/map/users/${this.props.currentUser.id}`} data-label="Your records" onClick={this.handleHamburgerOnClick.bind(this)}><span>Your records</span></Link>
                      }
                    </div>
                    <div className="m-tool-button m-tool-button--your-account">
                        {this.accountLink()}
                    </div>
                    <div className="m-tool-button m-tool-button--help">
                      <a href="/help-centre" data-label="Help"><span>Help</span></a>
                    </div>
                  </div>

                  <div className="m-error-logo">
                      <a href="https://error.agency"><img src={errorLogo} alt="Error made this" /></a>
                  </div>
              </div>

          </div>

          <div className="m-map-tray-switcher">
              <button className="to-tray" onClick={() => this.props.trayViewStore.toggleTrayVisibility()}><span>Switch to tray</span></button>
              <button className="to-map" onClick={() => this.props.trayViewStore.toggleTrayVisibility()}><span>Switch to map</span></button>
          </div>
      </Fragment>;
  }
}

// Tools.propTypes = {
//   mapViewStore: PropTypes.object.isRequired,
//   trayViewStore: PropTypes.object.isRequired
// };
