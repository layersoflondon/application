import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";

@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    //fixme: wire this component up to google maps
    console.log("TODO Search and pan the map...");
  }

  render() {
    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Pick a place to add a record or
          <input placeholder="Search" type="text" />
          <button onClick={this.handleOnClick.bind(this)}>Search</button>
        </div>
      </div>
    );
  }
}

PlacePicker.propTypes = {
};
