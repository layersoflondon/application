import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewGalleryMediaItem from './record_view_gallery_media_item';
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewAttribution extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>RecordViewAttribution</div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewAttribution);
