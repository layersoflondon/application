import React,{Component} from 'react';
import {inject} from "mobx-react";

export default class Tray extends Component {
  constructor(props) {
    super(props);

    console.log(props);
  }

  render() {
    return <div>
      TRAY
    </div>
  }
}
