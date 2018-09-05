import React,{Component} from 'react';
import {observer} from "mobx-react";

import {inject} from "mobx-react/index";

@inject('router')
@observer export default class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  handleCloseOnClick(event) {
    event.preventDefault();
    this.props.router.history.push('/map');
  }

  render() {
    return <div className='m-overlay'>
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
  }
}