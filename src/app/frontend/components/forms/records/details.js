import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dates from './dates';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="form-group form-group--title">
          <label>Title</label>
          <input type="text" data-name="name" value={this.state.name} onKeyUp={this.handleChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="10" placeholder="">
          </textarea>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Details);
