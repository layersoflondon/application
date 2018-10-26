import React,{Component} from 'react';
import RecordFormComponentState from "./record_form_component_state";

export default class LinkRow extends Component {
  constructor(props) {
    super(props);

    let attachable_url_valid = false;

    try {
      const url = new URL(this.props.link.attachable.url);
      attachable_url_valid = typeof(url) === "object" && this.props.link.attachable.url !== "http:";
    }catch(e) {
    }

    this.state = {link: this.props.link, attachable_url_valid: attachable_url_valid};

    console.log(`link_${this.props.index}`);
    window[`link_${this.props.index}`] = this.state;
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

    try {
      const url = new URL(this.state.link.attachable.url);

      state.attachable_url_valid = url && state.link.attachable.url !== "http:";
    }catch(e) {
    }

    this.setState(state);
  }

  handleOnBlur(event) {
    event.preventDefault();

    if( !this.props.recordFormStore.current_attachment_item ) {
      return;
    }

    if( this.state.attachable_url_valid ) {
      console.log("Persisting...", this.state.link, this.props.recordFormStore.current_attachment_item);
      this.state.link.persist().then((response) => {
        console.log("\n\nGot attachment: ", response.data);
        console.log("\n\n");

        this.state = {link: response.data, attachable_url_valid: true};
      }).catch((error) => {
        console.log("Error saving attachment", error);
      });
    }
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    console.log("Setting current to index ", this.props.index);
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
        </div>
        <div className="form-group">
          <button className="delete" onClick={this.deleteLink.bind(this)} title="Remove this link"><i className="fa fa-trash"></i></button>
        </div>
      </div>
    );
  }
}

// export default RecordFormComponentState.bindComponent(LinkRow);
