import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";

@withRouter
@observer export default class LightsOutTool extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let classes = "m-lights-out-tool";
    if( this.props.mapViewStore.lightsOut ) {
      classes += ` is-active`;
    }

    const label = this.props.mapViewStore.lightsOut ? 'Show Records' : 'Hide Records';

    return (
      <div className={classes}>
        <button onClick={() => this.props.mapViewStore.lightsOut=!this.props.mapViewStore.lightsOut}>{label}</button>
      </div>
    )
  }
}
