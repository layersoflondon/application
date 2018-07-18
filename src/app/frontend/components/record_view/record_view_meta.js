import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import RecordViewGalleryMediaItem from "./record_view_media_list_item";

@observer class RecordViewMeta extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="meta">
      <div className="dates">
        <span className="date start-date">{this.props.trayViewStore.record.date_from}</span>
      </div>
      <div className="creator">By {this.props.trayViewStore.record.user.name}</div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMeta);
