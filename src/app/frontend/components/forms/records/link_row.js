import React,{Component} from 'react';
import Attachment from "../../../models/attachment";

export default class LinkRow extends Component {
  constructor(props) {
    super(props);

    let attachable_url_valid = false;

    try {
      const url = new URL(this.props.link.attachable.url);
      attachable_url_valid = typeof(url) === "object" && this.props.link.attachable.url !== "http:";
    }catch(e) {
    }

    this.state = {link: this.props.link, attachable_url_valid: attachable_url_valid, attachable_url_validation_message: ""};

    // console.log(`link_${this.props.index}`);
    // window[`link_${this.props.index}`] = this.state;
    // this.state = {url: this.props.link.attachable.url, attachable_url_valid: attachable_url_valid, title: this.props.link.title};
  }

  handleOnChange(event) {
    const {name, value} = event.target;
    const state = this.state;

    this.props.recordFormStore.current_attachment_item[name] = value;

    if( name === "url" ) {
      this.props.recordFormStore.current_attachment_item.attachable.url = value;
      state.link.attachable[name] = value;
    }else {
      state.link[name] = value;
    }

    state.attachable_url_valid = false;

    if( !this.state.link ) {
      return false;
    }

    try {
      const url = new URL(this.state.link.attachable.url);

      state.attachable_url_valid = url && state.link.attachable.url !== "http:";
      if( state.attachable_url_valid ) {
        state.attachable_url_validation_message = "";
      }
    }catch(e) {
    }

    this.setState(state);
  }

  handleOnBlur(event) {
    event.preventDefault();

    if( !this.props.recordFormStore.current_attachment_item ) {
      return;
    }

    if( this.state.attachable_url_valid && this.state.link ) {
      this.state.link.persist().then((response) => {
        const link = Attachment.fromJS(response.data, this.state.link.record_id);
        const state = this.state;
        state.link = link;
        this.setState(state);
      }).catch((error) => {
        console.log("couldn't persist link", error);
        const state = this.state;
        state.attachable_url_valid = false;
        state.attachable_url_validation_message = error.response.data['attachable.url'][0];
        this.setState(state);
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
          <input placeholder="Title or description" type="text" name="title" onChange={this.handleOnChange.bind(this)} value={this.state.link.title} onBlur={this.handleOnBlur.bind(this)} />
        </div>
        <div className="form-group">
          <input placeholder="URL (http://www.bbc.co.uk for example)" type="text" name="url" className={url_class} onChange={this.handleOnChange.bind(this)} value={this.state.link.attachable.url} onBlur={this.handleOnBlur.bind(this)} />
          {!this.state.attachable_url_valid && this.state.attachable_url_validation_message.length>0 &&
          <span className='validation-message'>{this.state.attachable_url_validation_message}</span>
          }
        </div>
        <div className="form-group">
          <button className="delete" onClick={this.deleteLink.bind(this)} title="Remove this link"><i className="fa fa-trash"></i></button>
        </div>
      </div>
    );
  }
}

// export default RecordFormComponentState.bindComponent(LinkRow);
