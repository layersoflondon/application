import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dates from './dates';

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {title: ''};
  }

  render() {
    return (
      <div>
        <div className="form-group form-group--title">
          <label>Title</label>
          <input type="text" name="title" value={this.state.title} onChange={this.handleOnChange} onBlur={this.createDraftRecord} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea rows="10" placeholder="" name="description" value={this.state.description} onChange={this.handleOnChange}>
          </textarea>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Details);
