import React,{Component} from 'react';
import {observer} from "mobx-react";
import {NavLink} from 'react-router-dom';
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewDownloads extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const documents = this.props.trayViewStore.record.documents.map((document, i) => (
      <li key={`document_${i}`} className={`file-type-${document.attachable.suffix}`}><a href={document.attachable.url} target='_blank'>{document.title}</a></li>
    ));
    return <div className='downloads'>
      <h3>Files for download</h3>
      <ul>{documents}</ul>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewDownloads);
