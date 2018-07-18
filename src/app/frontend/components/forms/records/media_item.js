import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);

    this.state = {url: this.props.url, type: this.props.type, title: this.props.title, caption: this.props.caption, credit: this.props.credit};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  render() {
    const style = {};
    let type = '';
    let classes = 'image';

    if( this.props.type === 'image' ) {
      style['backgroundImage'] = `url("${this.state.url}")`
    }

    type += `type-${this.props.type}`;

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
