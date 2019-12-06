import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import {observer} from "mobx-react";

@observer class MediaItem extends Component {
  constructor(props){
    super(props);
    this.state = {url: this.props.object.attachable.thumb, type: this.props.object.media_type, title: this.props.title, caption: this.props.caption, credit: this.props.credit, deleted: false, deleting: false};
  }

  setCurrentMediaItem(event) {
    event.preventDefault();
    this.props.recordFormStore.current_attachment_item_index = this.props.index;
  }

  handleRemoveAttachment(event) {
    event.preventDefault();
    if (window.confirm("Delete this attachment? You'll need to upload again.")) {
      this.setState({deleting: true});
      // console.log("destroy: ", this.props.object, this.props.index);
      this.props.object.destroy().then((result) => {
        this.setState({deleting: false, deleted: true});
        //remove the deleted attachment from the record we are holding in the recordFormStore.
        const attachments = this.props.recordFormStore.record.attachments.slice();
        const index = this.props.recordFormStore.record.attachments.findIndex((a) => a.id === this.props.object.id);

        attachments.splice(index, 1);
        this.props.recordFormStore.record.attachments = attachments;
      }).catch((error) => {
        console.log("error destroying", error)
      });
    }

  }

  render() {
    const style = {};
    let container_classes = '';
    let classes = 'image';

    if( this.state.type === 'image' || this.state.type === 'video' ) {
      style['backgroundImage'] = `url("${this.state.url}")`;
    }
    container_classes += `type-${this.props.object.media_type}`;

    if( this.props.recordFormStore.current_attachment_item_index === this.props.index ) {
      container_classes = `${container_classes} is-selected`;
    }

    const removeLinkClass = (this.state.deleting) ? "fa fa-circle-o-notch fa-spin is-deleting" : "fa fa-times";

    return (
      <li className={container_classes}>
        <a className="remove-attachment" title="Remove attachment" onClick={this.handleRemoveAttachment.bind(this)}>
          <i className={removeLinkClass}></i>
        </a>
        <a onClick={this.setCurrentMediaItem.bind(this)}>
          <span className={classes} style={style} />
        </a>
      </li>
    )
  }
}

export default RecordFormComponentState.bindComponent(MediaItem);
