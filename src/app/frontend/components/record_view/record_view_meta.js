import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';

@observer class RecordViewMeta extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const clearRecord = () => {
      this.props.mapViewStore.recordModal = false;
      this.props.trayViewStore.record = null;
    }

    let author_prefix = '';
    if( this.props.trayViewStore.record.added_by_student ) {
      author_prefix = <span><strong>{this.props.trayViewStore.record.user.student_name}</strong>, a student of </span>
    }

    return <div className="meta">
      <div className="dates">
        <span className="date start-date">{this.props.trayViewStore.record.display_date_from}</span>
        {this.props.trayViewStore.record.display_date_to && 
        <React.Fragment>
          <span> to </span>
          <span className="date end-date">{this.props.trayViewStore.record.display_date_to}</span>
        </React.Fragment>
        }
      </div>
      <div className="creator">
        By {author_prefix}
        <Link to={`/map/users/${this.props.trayViewStore.record.user.id}`} onClick={clearRecord}>
          {this.props.trayViewStore.record.user.name}
        </Link>
      </div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMeta);
