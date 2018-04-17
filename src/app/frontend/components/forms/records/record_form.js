import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {observer} from "mobx-react";
import Details from './details';
import Dates from './dates';
import Media from './media';
import Links from './links';
import Collection from './collection';
import Team from './team';

@observer export default class RecordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {errors: []};
  }

  save(event) {
    event.preventDefault();
    this.props.recordFormStore.persist();
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'record_form' ) className+=" is-showing";

    return (
      <div className={className}>
        <div className="s-overlay--add-record is-showing">
          <div className="close">
            <button className="close" onClick={()=>this.props.mapViewStore.overlay=null}>Close</button>
          </div>
          <div className="m-add-record">
            <h1>Add record</h1>

            <form action="" className="form--chunky form--over-white">
              <Dates   {...this.props} />
              <Details {...this.props} />

              <div className="m-accordion">
                <Media {...this.props} />
                <Links {...this.props} />
                <Collection {...this.props} />
                <Team {...this.props} />
              </div>

              <button onClick={this.save.bind(this)}>ok</button>

            </form>
          </div>
        </div>
      </div>
    );
  }
}
