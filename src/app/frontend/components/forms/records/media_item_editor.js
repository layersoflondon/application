import React,{Component} from 'react';
import {debounce} from 'underscore';
import {observer} from "mobx-react";

// this component isn't bound to the RecordFormComponentState as it manages its own local state
// and pushes off changes to the current_attachment_item via the recordFormStore prop
@observer class MediaItemEditor extends Component {
  constructor(props){
    super(props);

    this.handleKeyUpWithDebounce = debounce(() => {
      this.props.recordFormStore.current_attachment_item.persist();
    }, 250);
  }

  handleOnChange(event) {
    const {name, value} = event.target;

    this.props.recordFormStore.current_attachment_item[name] = value;
  }

  handleOnBlur(event) {
    event.preventDefault();

    if( !this.props.recordFormStore.current_attachment_item ) {
      return;
    }

    const current_attachment_item = this.props.recordFormStore.current_attachment_item;

    current_attachment_item.persist().then((response) => {
      this.props.recordFormStore.current_attachment_item.id = response.data.id;
      console.log("persisted attachment", response, this.props.recordFormStore.current_attachment_item);
    }).catch((error) => {
      console.log("Error saving image", error);
    });
  }

  handleKeyUp(event) {
    const {name, value} = event.target;

    this.props.recordFormStore.current_attachment_item[name] = value;
    this.handleKeyUpWithDebounce();
  }

  handleOnSetAsPrimaryImage(event) {
    event.preventDefault();

    this.props.recordFormStore.record.media.map((i) => i.is_primary = false);

    this.props.recordFormStore.current_attachment_item.is_primary = true;
    this.props.recordFormStore.current_attachment_item.persist().then((response) => {
      this.props.trayViewStore.record.image = response.data.attachable;
    });
  }

  render() {
    const button_disabled = false; //this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.is_primary;
    const button_label    = (this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.is_primary) ? "Primary Image" : "Set as primary image";

    return (
      <div className="meta">
        <div className="caption">
          <div className="form-group">
            <label>Title</label>
            <input placeholder="Title" type="text" onChange={this.handleOnChange.bind(this)} name="title" value={(this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.title) ? this.props.recordFormStore.current_attachment_item.title : ''} onBlur={this.handleOnBlur.bind(this)} />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <textarea rows="5" placeholder="Caption" onChange={this.handleOnChange.bind(this)} name="caption" value={(this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.caption) ? this.props.recordFormStore.current_attachment_item.caption : ''} onBlur={this.handleOnBlur.bind(this)}  >
            </textarea>
          </div>
          <div className="form-group">
            <label>Credit</label>
            <input placeholder="Credit" type="text" onChange={this.handleOnChange.bind(this)} name="credit" value={(this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.credit) ? this.props.recordFormStore.current_attachment_item.credit : ''} onKeyUp={this.handleKeyUp.bind(this)} />
          </div>

          {this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.media_type === 'image' &&
           <div className="form-group">
             {this.props.recordFormStore.current_attachment_item.is_primary }
              <button onClick={this.handleOnSetAsPrimaryImage.bind(this)} disabled={button_disabled}>{button_label}</button>
           </div>
          }
        </div>
      </div>
    )
  }
}

export default MediaItemEditor;
