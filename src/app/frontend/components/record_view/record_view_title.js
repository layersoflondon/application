import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewTitle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="title">
      <h1>{this.props.trayViewStore.record.title}</h1>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewTitle);
