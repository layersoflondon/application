import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import Attachment from '../../../models/attachment';
import {observer} from "mobx-react";

@observer class YoutubeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {youtube_id: ""};

  }

  handleOnChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }


  saveUrl(event) {
    event.preventDefault();
    
    const attachments = this.props.recordFormStore.record.attachments.slice();
    const new_attachment = {attachable: {youtube_id: this.state.youtube_id}, attachable_type: "Attachments::Video"};
    const video = Attachment.fromJS(new_attachment, this.props.recordFormStore.record.id);

    video.persist().then((response) => {
      let data = response.data;

      // we need to add some attributes from the response to our media item
      // object so that it can be rendered in the media item component
      video.record_id = this.props.recordFormStore.record.id;
      video.id = data.id;
      video.attachable = data.attachable;
      video.attachable_type = data.attachable_type;

      this.setState({youtube_id: ""});
      
      attachments.push(video);
      this.props.recordFormStore.record.attachments = attachments;
    }).catch((error) => {
      console.log("Error persisting media item", error);
    }).then(() => {
      //todo mark as loading
      // const finished_loading = this.state.loading.slice();
      // finished_loading.splice(loading.indexOf(video.loaded_file), 1);
      // this.setState({loading: finished_loading});
    });
  }

  render() {
    const selectedClassName = "";
    return <div className={`form-group add-url ${selectedClassName}`}>
      <label>Add YouTube video with URL</label>
      <input type="text" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" name='youtube_id' value={this.state.youtube_id} onChange={this.handleOnChange.bind(this)} />
      <button onClick={this.saveUrl.bind(this)}>+</button>
      <span className="video-tip">Please add videos from other sources as a link, in the next section.</span>
    </div>
  }
}

export default RecordFormComponentState.bindComponent(YoutubeForm);