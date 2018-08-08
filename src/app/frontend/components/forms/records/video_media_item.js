import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class VideoMediaItem extends Component {
  constructor(props){
    super(props);

    const video_url = this.props.attachable.youtube_id ? `https://www.youtube.com/watch?v=${this.props.attachable.youtube_id}` : '';
    this.state = {url: video_url, type: this.props.object.media_type};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  handleUrlOnChange(event) {
    const {name, value} = event.target;

    this.setState({[name]: value});
    console.log(`Setting ${name} = ${value} on`, this.props.recordFormStore.current_attachment_item);
    this.props.recordFormStore.current_attachment_item[name] = value;
  }

  saveUrl(event) {
    console.log("Saving...");
    this.props.recordFormStore.current_attachment_item.persist();
  }

  render() {
    return (
      <div className="form-group add-url">
        <label>Youtube URL</label>
        <input type="text" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" name='url' value={this.state.url} onChange={this.handleUrlOnChange.bind(this)} onFocus={this.setCurrentMediaItem.bind(this)} onBlur={this.saveUrl.bind(this)} />
        {/*<button>+</button>*/}
      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(VideoMediaItem);
