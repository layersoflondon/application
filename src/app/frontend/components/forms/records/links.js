import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Links extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='links' ? 'block' : 'none'};

    return (
      <div className="section">
        <h2 className="title" data-name="links" onClick={this.togglePaneVisibility}>Links</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-add-links">
            <div className="link">
              <div className="form-group">
                <input placeholder="Title or description" type="text" />
              </div>
              <div className="form-group">
                <input placeholder="URL (http://www.bbc.co.uk for example)" type="text" />
              </div>
            </div>
            <button>Add another link</button>
          </div>
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Links);
