import React, {Component} from 'react';
import {inject} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';

@withRouter
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: null, errorInfo: null};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true, errorInfo: info});

    if (typeof Rollbar !== "undefined") {
      Rollbar.error(error);

      if (window.__USER_PRESENT) {
        Rollbar.configure({payload: {person: window.__USER}});
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className='m-overlay'>

        <div className="m-overlay-error">
          <h1>There was an error</h1>
          <p>We're really sorry - the website encountered an error. It's possible this is something temporary so it's
            worth trying again, or if you're having problems please <a href="/contact-us">get in touch</a> and let us
            know what you were doing when it broke. Our technical team has been notified.</p>
          <p><Link className="button" to="/map">Go back to the map</Link></p>
        </div>
      </div>
    }

    return this.props.children;
  }
}
