import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import RecordViewDownloads from './record_view_downloads';
import RecordViewLinks from './record_view_links';
import RecordViewText from './record_view_text';

@observer class RecordViewContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Fragment>
      {this.props.gallery}

      <div className="m-article">
        <div dangerouslySetInnerHTML={{__html: this.props.trayViewStore.record.description}} className='description'></div>
        {
          this.props.trayViewStore.record.text.length > 0 &&
          <RecordViewText {...this.props} />
        }
        {
          this.props.trayViewStore.record.documents.length > 0 &&
          <RecordViewDownloads {...this.props} />
        }
        {
          this.props.trayViewStore.record.links.length > 0 &&
          <RecordViewLinks {...this.props} />
        }
      </div>

      <div className="m-record-collections-list">
        <h3>Collections this record belongs to</h3>
        <ul>
          <li><a href="#">Duis augue ante efficitur et</a></li>
          <li><a href="#">Nunc viverra auctor nunc in id elit</a></li>
          <li><a href="#">Sed sed nulla accumsan, sagittis tellus ut, lacinia lacus fusce non leo</a></li>
        </ul>
      </div>

        {
            this.props.trayViewStore.record.credit &&
            <div className="m-record-credits">
              <h3>Sources and attribution</h3>
              <div dangerouslySetInnerHTML={{__html: this.props.trayViewStore.record.credit}}></div>
            </div>
        }

    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewContent);
