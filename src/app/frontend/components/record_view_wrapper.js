import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from 'react-router-dom';

import RecordViewComponentState from './record_view/record_view_component_state';
import RecordView from './record_view/record_view';

@inject('routing', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer class RecordViewWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <RecordView {...this.props} />
  }
}

export default RecordViewComponentState.bindComponent(RecordViewWrapper);
