import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {NavLink} from 'react-router-dom';

@observer class RecordViewMeta extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="meta">
      <div className="dates">
        <span className="date start-date">{this.props.trayViewStore.record.display_date_from}</span>
      </div>
      <div className="creator">By <NavLink to={`/map/users/${this.props.trayViewStore.record.user.id}`}>{this.props.trayViewStore.record.user.name}</NavLink></div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMeta);
