import React,{Component} from 'react';
import {observer} from "mobx-react";
import {NavLink} from 'react-router-dom';
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewLinks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const links = this.props.trayViewStore.record.links.map((link, i) => (
      <li key={`link_${i}`}><NavLink to={link.attachable.url} target='_blank'>{link.title}</NavLink></li>
    ));
    return <div><ul>{links}</ul></div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewLinks);
