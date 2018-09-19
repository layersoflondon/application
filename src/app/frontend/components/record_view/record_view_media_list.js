import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewMediaListItem from './record_view_media_list_item';
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';

@observer class RecordViewMediaList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let media = this.props.record.attachments.filter((a) => a.is_media_or_video);
    const media_items_total = media.length;
    const media_container_class = this.props.record.view_type === 'expanded' ? 'expanded' : 'thumbs';

    media = media.slice(0, this.props.numberOfItems);

    let media_components = <span />;
    let images = media.filter((m) => m.attachable_type === 'Attachments::Image');

    if( media_container_class === 'thumbs' && images.length > 1 ) {
      media_components = media.map((media) => <RecordViewMediaListItem key={`media_${media.id}`} media={media} record={this.props.record} />);
    }

    let expandable_media_list = false;

    if( this.props.record.media.length > media.length ) {
      expandable_media_list =  <div className="extra-count">
        <Link to={`/map/records/${this.props.record.id}/media/${media[0].id}`}>
          + <span>{media_items_total - this.props.numberOfItems}</span>
        </Link>
      </div>
    }

    return <div className={`m-record-media-list-${media_container_class}`}>
      {media_components}
      {expandable_media_list}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMediaList);
