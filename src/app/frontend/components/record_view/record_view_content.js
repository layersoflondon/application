import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import RecordViewDownloads from './record_view_downloads';
import RecordViewLinks from './record_view_links';

@observer class RecordViewContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      {this.props.gallery}

      <div className="m-article">
        <div dangerouslySetInnerHTML={{__html: this.props.trayViewStore.record.description}}></div>
        <RecordViewDownloads {...this.props} />
        <RecordViewLinks {...this.props} />
      </div>

    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewContent);
