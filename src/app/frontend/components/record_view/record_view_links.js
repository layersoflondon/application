import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewLinks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const links = this.props.trayViewStore.record.links.map((link, i) => (
      <li key={`link_${i}`}><a href={link.attachable.url} target='_blank'>{link.title}</a></li>
    ));
    return <div className="links">
      <h3>Related Links</h3>
      <ul>{links}</ul>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewLinks);
