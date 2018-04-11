import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);

    this.state = {data: this.props.data, type: this.props.type, title: this.props.title, description: this.props.description, credit: this.props.credit};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_media_item_index = this.props.index;
  }

  render() {
    const style = {backgroundImage: `url("${this.state.data}")`};
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
