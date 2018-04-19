import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import PlaceDetails from './place_details';
import {observer} from 'mobx-react';

@observer class Details extends Component {
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

        <PlaceDetails {...this.props} />

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
