import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewGalleryMediaItem from './record_view_gallery_media_item';
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewGallery extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>RecordViewGallery</div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewGallery);
