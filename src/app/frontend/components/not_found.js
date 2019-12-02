import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';
import {inject} from "mobx-react";
import {closeModalLink} from '../helpers/modals';

@inject('router', 'mapViewStore')
@observer export default class NotFound extends Component {
  constructor(props) {
    super(props);
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
            <Link to={closeModalLink(this.props.router.location, 'record')} className="close">Close</Link>
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