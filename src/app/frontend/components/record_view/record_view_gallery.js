import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewGalleryMediaItem from './record_view_gallery_media_item';
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewGallery extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const media = this.props.trayViewStore.record.media.map((media, i) => <RecordViewGalleryMediaItem key={`record_${this.props.trayViewStore.record.id}_${i}`} media={media} />);

    return <div>
      {media}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewGallery);
