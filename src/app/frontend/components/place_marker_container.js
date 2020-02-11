import React, {Component} from 'react';
import {observer} from "mobx-react";

@observer export default class PlaceMarkerContainer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {

  }

  render() {
    console.log(this.props.place.svg)
    return <div>place</div>;
  }
}
