import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import MediaItem from './media_item';
import VideoMediaItem from './video_media_item';
import MediaItemEditor from './media_item_editor';
import Attachment from '../../../models/attachment';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {is_visible: false, items: this.props.recordFormStore.record.attachments, errors: []};
  }

  onDrop(acceptedFiles, rejectedFiles, event) {
    rejectedFiles.forEach(() => {
      console.log(arguments);
    });

    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onload = (f) => {
        const attachment_type = (type) => {
          //content_type = type.split("/")[0];
          switch(type) {
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/png':
              return 'image';
            case 'text/plain':
              return 'document';
            case 'application/pdf':
              return 'document';
            case 'application/json':
              return 'geodata';
            case 'audio/mpeg':
            case 'audio/m4a':
              return 'audio_file';
            default:
              return null;
          }
        };

        // const fileData = reader.result; // the base64 encoded string
        const attachments = this.props.recordFormStore.record.attachments.slice();
        const new_attachment = {file: file, url: file.preview, attachable_type: `Attachments::${attachment_type(file.type).toUpperCase()}`, type: attachment_type(file.type), title: f.target.fileName, caption: '', credit: ''};

        if( !attachment_type(file.type)) {
          this.setState({errors: ['Unsupported file type']});
        }

        const media_item = Attachment.fromJS(new_attachment, this.props.recordFormStore.record.id);

        media_item.persist().then((response) => {
          let data = response.data;
          // we need to add some attributes from the response to our media item
          // object so that it can be rendered in the media item component
          media_item.record_id = this.props.recordFormStore.record.id;
          media_item.id = data.id;
          media_item.attachable = data.attachable;
          media_item.attachable_type = data.attachable_type;

          attachments.push(media_item);
          this.props.recordFormStore.record.attachments = attachments;
        }).catch((error) => {
          console.log("Error persisting media item", error);
        });
      };

      reader.fileName = file.name;
      reader.readAsDataURL(file);
    });
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='media' ? 'block' : 'none'};

    const media_items = this.props.recordFormStore.record.documents_and_images.map((item,i) => {
      const media_item = Attachment.fromJS(item, this.props.recordFormStore.record.id);
      const index = this.props.recordFormStore.record.attachments.indexOf(item);
      return <MediaItem {...item} {...this.props} object={media_item} key={`media_item_${index}`} index={index} current_attachment_item_index={this.props.recordFormStore.current_attachment_item_index} />
    });

    const video_items = this.props.recordFormStore.record.videos.map((item, i) => {
      const video_item = Attachment.fromJS(item, this.props.recordFormStore.record.id);
      const index = this.props.recordFormStore.record.attachments.indexOf(item);
      return <VideoMediaItem {...item} {...this.props} object={video_item} key={`video_media_item_${index}`} index={index} />
    });

    return (
      <div className="section">
        <h2 className="title" data-name="media" onClick={this.togglePaneVisibility}>Add media &amp; documents</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-media-and-documents">

            <div className="add-tools">

              {(video_items.length > 0 && video_items) || <VideoMediaItem {...this.props} object={new Attachment()} /> }
            </div>

            <div className="thumbs">
              <Dropzone disableClick={true} onClick={()=>console.log("clicked")} activeStyle={{border: '1px solid #c2c2c2'}} accept="image/jpeg, image/png, application/pdf, text/plain, application/json, audio/mpeg, audio/m4a" onDrop={this.onDrop.bind(this)}>
                <ul>
                  {media_items}

                  <li className="add">
                    <a href="#"><span className="image"></span><em>Drag &amp; drop</em></a>
                  </li>
                </ul>
              </Dropzone>
            </div>

            <MediaItemEditor {...this.props} current_attachment_item_index={this.props.recordFormStore.current_attachment_item_index} />
          </div>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Media);
