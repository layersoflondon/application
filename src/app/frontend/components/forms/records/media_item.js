import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);

    this.state = {file: this.props.file, type: this.props.type, title: this.props.title, description: this.props.description, credit: this.props.credit};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  render() {
    const style = {backgroundImage: `url("${this.state.file}")`};

    if( this.props.recordFormStore.current_attachment_item_index === this.props.index ) {
      style['border'] = '1px solid #222';
      style['marginTop'] = '-1px';
    }

    return (
      <li className="type-image" onClick={this.setCurrentMediaItem.bind(this)}>
        <a href="#">
          <span className="image random-image" style={style} />
        </a>
      </li>
    )
  }
}

export default RecordFormComponentState.bindComponent(MediaItem);
