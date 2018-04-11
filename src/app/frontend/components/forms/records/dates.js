import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

class Dates extends Component {
  constructor(props) {
    super(props);

    this.state = {date_to_visible: false}
  }

  render() {
    return (
      <div className="form-group form-group--date">
        <div className="start-date">
          <label>When did this happen?</label>
          <input placeholder="Day" type="text" />
          <input placeholder="Month" type="text" />
          <input placeholder="Year" type="text" />
          <span className="helper-text">An estimate is ok - an exact date is fantastic!</span>
        </div>

        <div className="end-date-link">
          <a onClick={()=>{this.state.date_to_visible = !this.state.date_to_visible}}>Can you add an end date?</a> Useful for events, and places that may no longer exist.
        </div>

        <div className="end-date">
          <label>When did this end?</label>
          <input placeholder="Day" type="text" />
          <input placeholder="Month" type="text" />
          <input placeholder="Year" type="text" />
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Dates);
