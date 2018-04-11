import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Collection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};

    return (
      <div className="section">
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>Add to a collection</h2>

        <div className="pane" style={pane_styles}>
          todo
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Collection);
