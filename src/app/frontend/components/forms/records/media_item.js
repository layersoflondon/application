import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);

    this.state = {url: this.props.object.attachable.url, type: this.props.object.media_type, title: this.props.title, caption: this.props.caption, credit: this.props.credit};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  render() {
    const style = {};
    let container_classes = '';
    let classes = 'image';

    if( this.state.type === 'image' ) {
      style['backgroundImage'] = `url("${this.state.url}")`;
    }

    container_classes += `type-${this.props.object.media_type}`;

    if( this.props.recordFormStore.current_attachment_item_index === this.props.index ) {
      container_classes = `${container_classes} is-selected`;
    }

    return (
      <li className={container_classes} onClick={this.setCurrentMediaItem.bind(this)}>
        <a href="#">
          <span className={classes} style={style} />
        </a>
      </li>
    )
  }
}

export default RecordFormComponentState.bindComponent(MediaItem);
