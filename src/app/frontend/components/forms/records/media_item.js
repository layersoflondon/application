import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);

    console.log("Attachable", this.props.object);

    this.state = {url: this.props.object.url, type: this.props.object.media_type, title: this.props.title, caption: this.props.caption, credit: this.props.credit};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  render() {
    const style = {};
    let type = '';
    let classes = 'image';

    if( this.state.type === 'image' ) {
      style['backgroundImage'] = `url("${this.state.url}")`;
    }

    type += `type-${this.props.object.media_type}`;

    return (
      <li className={type} onClick={this.setCurrentMediaItem.bind(this)}>
        <a href="#">
          <span className={classes} style={style} />
        </a>
      </li>
    )
  }
}

export default RecordFormComponentState.bindComponent(MediaItem);
