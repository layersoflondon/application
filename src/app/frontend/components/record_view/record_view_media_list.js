import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewMediaListItem from './record_view_media_list_item';
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewMediaList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const media = this.props.record.media.map((media) => <RecordViewMediaListItem key={`media_${media.id}`} media={media} showCaption={this.props.record.view_type === 'expanded'} showAttribution={this.props.record.view_type === 'expanded'} />);

    const media_container_class = this.props.record.view_type === 'expanded' ? 'expanded' : 'thumbs';
    return <div className={`m-record-media-list-${media_container_class}`}>
      {media}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMediaList);
