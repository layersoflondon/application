import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewGalleryMediaItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>RecordViewGalleryMediaItem</div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewGalleryMediaItem);
