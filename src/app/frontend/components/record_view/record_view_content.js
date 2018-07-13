import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="m-article">
      {this.props.gallery}
      {this.props.trayViewStore.record.description}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewContent);
