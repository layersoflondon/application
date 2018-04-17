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

  render() {
    if( this.props.recordFormStore.current_attachment_item ) {
      console.log("record_id = ", this.props.recordFormStore.current_attachment_item.record_id);
    }else {
      console.log("no current_attachment_item");
    }

    return (
      <div className="meta">
        <div className="caption">
          <div className="form-group">
            <label>Title</label>
            <input placeholder="Title" type="text" onChange={this.handleOnChange.bind(this)} name="title" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.title : ''} />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <textarea rows="5" placeholder="Caption" onChange={this.handleOnChange.bind(this)} name="description" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.description : ''} >
            </textarea>
          </div>
          <div className="form-group">
            <label>Credit</label>
            <input placeholder="Credit" type="text" onChange={this.handleOnChange.bind(this)} name="credit" value={this.props.recordFormStore.current_attachment_item ? this.props.recordFormStore.current_attachment_item.credit : ''} />
          </div>
          <div className="form-group">
            <button>Set as primary image</button>
          </div>
        </div>
      </div>
    )
  }
}

export default MediaItemEditor;
