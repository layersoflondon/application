import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import RecordViewDownloads from './record_view_downloads';
import RecordViewLinks from './record_view_links';
import RecordViewTags from './record_view_tags';
import RecordViewText from './record_view_text';
import {Link }from 'react-router-dom';
import RecordViewComments from "./record_view_comments";

@observer class RecordViewRelated extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return <Fragment>
        <div className="m-related-records">
          
        </div>
    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewRelated);
