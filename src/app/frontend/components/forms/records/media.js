import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import MediaItem from './media_item';
import MediaItemEditor from './media_item_editor';
import MediaItemStore from '../../../stores/media_item_store';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {is_visible: false, items: this.props.recordFormStore.record.attachments};
  }

  onDrop(acceptedFiles, rejectedFiles, event) {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onload = (f) => {
        // const fileData = reader.result; // the base64 encoded string
        const attachments = this.props.recordFormStore.record.attachments.slice();
        const new_attachment = {file: file, url: file.preview, attachment_type: file.type.split("/")[0], title: f.target.fileName, description: '', credit: ''};

        const media_item = new MediaItemStore(this.props.recordFormStore.record.id, new_attachment);
        media_item.persist().then((response) => {
          let data = response.data;
          media_item.record_id = this.props.recordFormStore.record.id;
          media_item.id = data.id;
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
    window.record = this.props.recordFormStore.record;

    const pane_styles = {display: this.props.recordFormStore.visible_pane==='media' ? 'block' : 'none'};

    const media_items = this.props.recordFormStore.record.attachments.map((item,i) => {
      let media_item = new MediaItemStore(this.props.recordFormStore.record.id, item);
      return <MediaItem {...item} {...this.props} object={media_item} key={i} index={i} current_attachment_item_index={this.props.recordFormStore.current_attachment_item_index} />
    });

    return (
      <div className="section">
        <h2 className="title" data-name="media" onClick={this.togglePaneVisibility}>Add media &amp; documents</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-media-and-documents">

            <div className="thumbs">
              <Dropzone disableClick={true} onClick={()=>console.log("clicked")} activeStyle={{border: '1px solid #c2c2c2'}} accept="image/jpeg, image/png" onDrop={this.onDrop.bind(this)}>
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
