import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";
import Attachment from "../../../models/attachment";
import LinkRow from "./link_row";
import ErrorBoundary from "../../error_boundary";

@observer class Links extends Component {
  constructor(props) {
    super(props);
  }

  addLinkFormFieldRow(event) {
    event.preventDefault();

    const attachments = this.props.recordFormStore.record.attachments.slice();
    const new_attachment = {url: '', attachable_type: "Attachments::Url", attachable: {url: ''}, title: ''};
    const new_link = Attachment.fromJS(new_attachment, this.props.recordFormStore.record.id);
    attachments.push(new_link);
    this.props.recordFormStore.record.attachments = attachments;
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='links' ? 'block' : 'none'};
    let pane_classname = (this.props.recordFormStore.visible_pane==='links') ? 'is-open' : '';
    
    if(!this.props.recordFormStore.record.id) {
      pane_classname = `${pane_classname} is-disabled`;
    }

    let links = this.props.recordFormStore.record.links.map((link, i) => {
      let index = this.props.recordFormStore.record.attachments.indexOf(link);
      const key = link.id ? `${i}-${link.id}` : Math.random();

      return <ErrorBoundary key={key}>
        <LinkRow link={link} index={index} recordFormStore={this.props.recordFormStore} />
      </ErrorBoundary>
    });

    return (
      <div className={`section ${pane_classname}`}>
        <h2 className="title" data-name="links" onClick={this.togglePaneVisibility}>Links</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-links">
            {links}
            <button onClick={this.addLinkFormFieldRow.bind(this)}>Add a related link</button>
          </div>
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Links);
