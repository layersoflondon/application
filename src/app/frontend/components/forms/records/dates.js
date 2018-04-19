import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from 'mobx-react';

@observer class Dates extends Component {
  constructor(props) {
    super(props);

    this.state = {date_to_visible: false}
  }

  handleOnDateChange(event) {
    let date_object = {...this.props.recordFormStore[event.target.dataset.dateField]};
    date_object[event.target.dataset.dateAttributeName] = event.target.value;
    this.props.recordFormStore[event.target.dataset.dateField] = date_object;
  }

  show_end_date_component() {
    return this.props.recordFormStore.date_to || this.state.date_to_visible;
  }

  end_date_component() {
    return (
      <div className="end-date">
        <label>When did this end?</label>
        <input placeholder="Day" type="text" name="date_to_day" data-date-field="date_to_object" data-date-attribute-name="date" value={this.props.recordFormStore.date_to_object.date} onChange={this.handleOnDateChange.bind(this)} />
        <input placeholder="Month" type="text" name="date_to_month" data-date-field="date_to_object" data-date-attribute-name="month" value={this.props.recordFormStore.date_to_object.month} onChange={this.handleOnDateChange.bind(this)} />
        <input placeholder="Year" type="text" name="date_to_year" data-date-field="date_to_object" data-date-attribute-name="year" value={this.props.recordFormStore.date_to_object.year} onChange={this.handleOnDateChange.bind(this)} />
      </div>
    );
  }

  render() {
    return (
      <div className="form-group form-group--date">
        <div className="start-date">
          <label>When did this happen?</label>
          <input placeholder="Day" type="text" name="date_from_day" data-date-field="date_from_object" data-date-attribute-name="date" value={this.props.recordFormStore.date_from_object.date} onChange={this.handleOnDateChange.bind(this)} />
          <input placeholder="Month" type="text" name="date_from_month" data-date-field="date_from_object" data-date-attribute-name="month" value={this.props.recordFormStore.date_from_object.month} onChange={this.handleOnDateChange.bind(this)} />
          <input placeholder="Year" type="text" name="date_from_year" data-date-field="date_from_object" data-date-attribute-name="year" value={this.props.recordFormStore.date_from_object.year} onChange={this.handleOnDateChange.bind(this)} />
          <span className="helper-text">An estimate is ok - an exact date is fantastic!</span>
        </div>

        <div className="end-date-link">
          <a onClick={()=>{this.setState({date_to_visible: !this.state.date_to_visible})}}>Can you add an end date?</a> Useful for events, and places that may no longer exist.
        </div>

        {this.show_end_date_component() && this.end_date_component()}
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Dates);
