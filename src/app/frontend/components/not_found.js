import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import Helmet from 'react-helmet';

import {inject} from "mobx-react/index";

@inject('router', 'mapViewStore')
@observer export default class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  handleCloseOnClick(event) {
    event.preventDefault();

    let newLocation = '/map';
    
    if(this.props.mapViewStore.previousLocation) {
      newLocation = this.props.mapViewStore.previousLocation;
    }

    this.props.router.history.push(newLocation);
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>Content not found</title>
          <meta name='robots' content='noindex,nofollow' />
        </Helmet>
        <div className='m-overlay'>
          <div className="close">
            <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
          </div>

          <div className="m-add-record">
            <h1>Content not found</h1>

            <p>
              There is no content at this address. If you think this is a mistake please <a href="/contact-us">get in touch</a>
            </p>
          </div>
        </div>
      </Fragment>)
  }
}