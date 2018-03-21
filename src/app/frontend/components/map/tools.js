import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class Tools extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      tools
    </div>;
  }
}
