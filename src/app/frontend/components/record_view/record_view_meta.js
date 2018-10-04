import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {NavLink} from 'react-router-dom';

@observer class RecordViewMeta extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let author_prefix = '';
    if( this.props.trayViewStore.record.added_by_student ) {
      author_prefix = <span><strong>{this.props.trayViewStore.record.user.student_name}</strong>, a student of </span>
    }

    return <div className="meta">
      <div className="dates">
        <span className="date start-date">{this.props.trayViewStore.record.display_date_from}</span>
      </div>
      <div className="creator">By {author_prefix}<NavLink to={`/map/users/${this.props.trayViewStore.record.user.id}`}>{this.props.trayViewStore.record.user.name}</NavLink></div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMeta);
