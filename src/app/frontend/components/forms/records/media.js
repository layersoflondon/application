import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import MediaItem from './media_item';
import VideoMediaItem from './video_media_item';
import MediaItemEditor from './media_item_editor';
import Attachment from '../../../models/attachment';
import Image from 'react-image';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {is_visible: false, items: this.props.recordFormStore.record.attachments, errors: [], loading: []};

    this.fileInputRef = React.createRef();

    // if we're editing/creating a record that doesn't have a video associated, stub out a video object that we can edit
    if(this.props.recordFormStore.record.videos.length === 0) {
      const video_item = Attachment.fromJS({attachable_type: 'Attachments::Video', attachable: {title: '', caption: '', youtube_id: ''}}, this.props.recordFormStore.record.id);
      this.props.recordFormStore.record.attachments.push(video_item);
    }
  }

  showFileInput(event) {
    event.preventDefault();
    this.fileInputRef.current.click();
  }

  onFileInputChange(event) {
    this.onDrop(Array.from(event.target.files), []);
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

        const loading = this.state.loading.slice();

        const loaded_file = {url: file.preview, type: attachment_type(file.type)};
        loading.push(loaded_file);

        this.setState({loading: loading});

        // const fileData = reader.result; // the base64 encoded string
        const attachments = this.props.recordFormStore.record.attachments.slice();
        const new_attachment = {file: file, url: file.preview, attachable_type: `Attachments::${attachment_type(file.type).toUpperCase()}`, type: attachment_type(file.type), title: f.target.fileName, caption: '', credit: ''};

        if( !attachment_type(file.type)) {
          this.setState({errors: ['Unsupported file type']});
        }

        const media_item = Attachment.fromJS(new_attachment, this.props.recordFormStore.record.id);
        media_item.loaded_file = loaded_file;

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
        }).then(() => {
          const finished_loading = this.state.loading.slice();
          finished_loading.splice(loading.indexOf(media_item.loaded_file), 1);
          this.setState({loading: finished_loading});
        });
      };

      reader.fileName = file.name;
      reader.readAsDataURL(file);
    });
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='media' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='media') ? 'is-open' : '';

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

    const loading_items = this.state.loading.map((item, i) => {
      return <li className={`loading type-${item.type}`} key={`loading_${i}`}>
        <span className={item.type} style={{backgroundImage: `url(${item.url})`}}>
          <span className="is-loading">
          </span>
        </span>
      </li>
    });

    return (
      <div className={`section ${pane_classname}`}>
        <h2 className="title" data-name="media" onClick={this.togglePaneVisibility}>Add media &amp; documents</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-media-and-documents">

            <div className="add-tools">
              <div className="form-group add-file">
                <a href="#" onClick={this.showFileInput.bind(this)}><span className="image"></span><em>Upload a file</em></a>
                <input type="file" ref={this.fileInputRef} onChange={this.onFileInputChange.bind(this)} style={{display: 'none'}} />
              </div>
              {video_items}
            </div>

            <div className="thumbs">
              <Dropzone className="dropzone" disableClick={true} onClick={()=>console.log("clicked")} activeClassName={"is-active"} activeStyle={{border: '0'}} accept="image/jpeg, image/png, application/pdf, text/plain, application/json, audio/mpeg, audio/m4a" onDrop={this.onDrop.bind(this)}>
                <ul>
                  {media_items}

                  {loading_items}

                  {(this.state.loading.length > 0 || this.props.recordFormStore.record.documents_and_images.length > 0) && (
                    <ul>
                      <li className="add">
                        <a href="#"><span className="image"></span><em>Drag &amp; drop</em></a>
                      </li>
                    </ul>
                  )}
                </ul>

                {(this.state.loading.length === 0 && this.props.recordFormStore.record.documents_and_images.length === 0) && (
                  <div className="add add-files">
                    <a href="#">
                      <em>Your files will appear here, or you can drag and drop them.</em>
                    </a>
                  </div>
                )}
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
