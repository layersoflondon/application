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
    let media = this.props.record.media;
    const media_items_total = media.length;

    media = media.slice(0, this.props.numberOfItems);
    let media_components = media.map((media) => <RecordViewMediaListItem key={`media_${media.id}`} media={media} showCaption={this.props.record.view_type === 'expanded'} showAttribution={this.props.record.view_type === 'expanded'} />);

    let expandable_media_list = false;
    if( this.props.record.media.length > media.length ) {
      expandable_media_list =  <div className="extra-count">
        <Link to={`/map/records/${this.props.record.id}/media/1/image`}>
          + <span>{media_items_total - this.props.numberOfItems}</span>
        </Link>
      </div>
    }

    const media_container_class = this.props.record.view_type === 'expanded' ? 'expanded' : 'thumbs';
    return <div className={`m-record-media-list-${media_container_class}`}>
      {media_components}
      {expandable_media_list}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMediaList);
