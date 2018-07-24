import React, {Component, Fragment} from 'react';
import {observer} from "mobx-react";
import {NavLink} from 'react-router-dom';
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const text = this.props.trayViewStore.record.text.map((document, i) => (
      <div className="text-content" dangerouslySetInnerHTML={{__html: document.attachable.content}} key={`document-${this.props.trayViewStore.record.id}-attachable-${i}`}></div>
    ));
    return <Fragment>
      {text}
    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewText);