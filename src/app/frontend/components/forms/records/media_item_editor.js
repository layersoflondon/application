import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

// this component isn't bound to the RecordFormComponentState as it manages its own local state
// and pushes off changes to the current_attachment_item via the recordFormStore prop
@observer class MediaItemEditor extends Component {
  constructor(props){
    super(props);
    // this.state = this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.state : {title: '', description: '', credit: '', default: false};
  }

  handleOnChange(event) {
    const {name, value} = event.target;

    this.props.recordFormStore.current_attachment_item[name] = value;
  }

  handleOnBlur(event) {
    event.preventDefault();

    const current_attachment_item = this.props.recordFormStore.current_attachment_item;

    current_attachment_item.persist().then((response) => {
      console.log("Saved image");
    }).catch((error) => {
      console.log("Error saving image", error);
    });
  }

  handleOnClick(event) {
    event.preventDefault();

    this.props.recordFormStore.current_attachment_item.is_primary = true;
    this.props.recordFormStore.current_attachment_item.persist();
  }

  render() {
    return (
      <div className="meta">
        <div className="caption">
          <div className="form-group">
            <label>Title</label>
            <input placeholder="Title" type="text" onChange={this.handleOnChange.bind(this)} name="title" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.title : ''} onBlur={this.handleOnBlur.bind(this)} />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <textarea rows="5" placeholder="Caption" onChange={this.handleOnChange.bind(this)} name="caption" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.caption : ''}onBlur={this.handleOnBlur.bind(this)}  >
            </textarea>
          </div>
          <div className="form-group">
            <label>Credit</label>
            <input placeholder="Credit" type="text" onChange={this.handleOnChange.bind(this)} name="credit" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.credit : ''} onBlur={this.handleOnBlur.bind(this)} />
          </div>

          {this.props.recordFormStore.current_attachment_item && this.props.recordFormStore.current_attachment_item.type === 'image' &&
           <div className="form-group">
              <button onClick={this.handleOnClick.bind(this)}>Set as primary image</button>
           </div>
          }
        </div>
      </div>
    )
  }
}

export default MediaItemEditor;
