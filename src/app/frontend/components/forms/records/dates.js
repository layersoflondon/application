import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from 'mobx-react';

@observer class Dates extends Component {
  constructor(props) {
    super(props);

    this.state = {date_to_visible: !!this.props.recordFormStore.record.date_to};
  }

  handleOnDateChange(event) {
    let date_object = {...this.props.recordFormStore.record[event.target.dataset.dateField]};
    date_object[event.target.dataset.dateAttributeName] = event.target.value;

    this.props.recordFormStore.record[event.target.dataset.dateField] = date_object;
  }

  handleShowEndDateOnClick(event) {
    this.setState({date_to_visible: !this.state.date_to_visible});
  }

  render() {
    const dateFromLabelClassName = !!this.props.recordFormStore.record.errors_on_publishing['date_from'] ? "errors-on-publish" : "";
    const dateToLabelClassName = !!this.props.recordFormStore.record.errors_on_publishing['date_to'] ? "errors-on-publish" : "";
    return (
      <div className="form-group form-group--date">
        <div className="start-date">
          <label className={dateFromLabelClassName}>When did this happen?</label>
            <div className="date-input-wrap">
              <input placeholder="Day" type="text" name="date_from_day" data-date-field="date_from_object" data-date-attribute-name="date" value={this.props.recordFormStore.record.date_from_object.date} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
              <input placeholder="Month" type="text" name="date_from_month" data-date-field="date_from_object" data-date-attribute-name="month" value={this.props.recordFormStore.record.date_from_object.month} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
              <input placeholder="Year" type="text" name="date_from_year" data-date-field="date_from_object" data-date-attribute-name="year" value={this.props.recordFormStore.record.date_from_object.year} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
            </div>
          <span className="helper-text">An estimate is ok - an exact date is fantastic!</span>
        </div>

        {!this.state.date_to_visible && (
          <div className="end-date-link">
            <a href="#" onClick={this.handleShowEndDateOnClick.bind(this)}>Can you add an end date?</a> Useful for events, and places that may no longer exist.
          </div>
        )}

        {this.state.date_to_visible && (
          <div className="end-date">
            <label onClick={this.handleShowEndDateOnClick.bind(this)} className={dateToLabelClassName}>When did this end?</label>
            <div>
              <input placeholder="Day" type="text" name="date_to_day" data-date-field="date_to_object" data-date-attribute-name="date" value={this.props.recordFormStore.record.date_to_object.date} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
              <input placeholder="Month" type="text" name="date_to_month" data-date-field="date_to_object" data-date-attribute-name="month" value={this.props.recordFormStore.record.date_to_object.month} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
              <input placeholder="Year" type="text" name="date_to_year" data-date-field="date_to_object" data-date-attribute-name="year" value={this.props.recordFormStore.record.date_to_object.year} onChange={this.handleOnDateChange.bind(this)} onBlur={this.handleOnBlur} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Dates);
