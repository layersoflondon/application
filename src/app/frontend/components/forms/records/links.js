import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";
import Attachment from "../../../models/attachment";

class LinkRow extends Component {
  constructor(props) {
    super(props);

    let attachable_url_valid = false;

    try {
      const url = new URL(this.props.link.attachable.url);
      attachable_url_valid = typeof(url) === "object" && this.props.link.attachable.url !== "http:";
    }catch(e) {
    }

    this.state = {url: this.props.link.attachable.url, attachable_url_valid: attachable_url_valid, title: this.props.link.title};
  }

  handleOnChange(event) {
    const {name, value} = event.target;
    const state = this.state;

    this.props.recordFormStore.current_attachment_item[name] = value;
    state[name] = value;

    state.attachable_url_valid = false;

    try {
      const url = new URL(this.state.url);

      state.attachable_url_valid = url && state.url !== "http:";
    }catch(e) {
    }

    this.setState(state);
  }

  handleOnBlur(event) {
    event.preventDefault();

    if( !this.props.recordFormStore.current_attachment_item ) {
      return;
    }

    const current_attachment_item = this.props.recordFormStore.current_attachment_item;

    const {name,value} = event.target;

    if( this.state.attachable_url_valid ) {
      current_attachment_item.persist().then((response) => {
        this.props.recordFormStore.current_attachment_item.id = response.data.id;
      }).catch((error) => {
        console.log("Error saving attachment", error);
      });
    }
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  deleteLink(event) {
    const attachments = this.props.recordFormStore.record.attachments.slice();

    this.props.link.destroy().then((response) => {
      const updated_attachments = attachments.filter((a) => a.id !== this.props.link.id);
      this.props.recordFormStore.record.attachments = updated_attachments;
    });
  }

  render() {
    const url_class = this.state.attachable_url_valid ? '' : "has-errors";

    return (
      <div className="link" onClick={this.setCurrentMediaItem.bind(this)}>
        <div className="form-group">
          <input placeholder="Title or description" type="text" name="title" onChange={this.handleOnChange.bind(this)} value={this.state.title} onBlur={this.handleOnBlur.bind(this)} />
        </div>
        <div className="form-group">
          <input placeholder="URL (http://www.bbc.co.uk for example)" type="text" name="url" className={url_class} onChange={this.handleOnChange.bind(this)} value={this.state.url} onBlur={this.handleOnBlur.bind(this)} />
        </div>
        <div className="form-group">
          <button className="delete" onClick={this.deleteLink.bind(this)}>&times; {this.props.link.id}  </button>
        </div>
      </div>
    );
  }
}

@observer class Links extends Component {
  constructor(props) {
    super(props);
  }

  addLinkFormFieldRow(event) {
    event.preventDefault();

    const attachments = this.props.recordFormStore.record.attachments.slice();
    const new_attachment = {url: '', attachable_type: "Attachments::Url", title: ''};
    const new_link = Attachment.fromJS(new_attachment, this.props.recordFormStore.record.id);
    attachments.push(new_link);
    this.props.recordFormStore.record.attachments = attachments;
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='links' ? 'block' : 'none'};

    let links = this.props.recordFormStore.record.links.map((link, i) => {
      let index = this.props.recordFormStore.record.links.indexOf(link);
      return <LinkRow key={`${i}-${link.id}`} link={link} index={index} recordFormStore={this.props.recordFormStore} />
    });

    return (
      <div className="section">
        <h2 className="title" data-name="links" onClick={this.togglePaneVisibility}>Links</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-links">
            {links}
            <button onClick={this.addLinkFormFieldRow.bind(this)}>Add another link</button>
          </div>
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Links);
