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
    let hero_image = this.props.record.hero_image_media_item;
    let media = this.props.record.attachments.filter((a) => { return a.is_media_or_video && (hero_image && a.id !== hero_image.id) });

    console.log(media, hero_image);

    const media_items_total = media.length;
    const media_container_class = this.props.record.view_type === 'expanded' ? 'expanded' : 'thumbs';

    media = media.slice(0, this.props.numberOfItems);

    let media_components = <span />;

    if( media_container_class === 'thumbs' ) {
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
