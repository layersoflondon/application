import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import PlaceDetails from './place_details';
import {observer} from 'mobx-react';
import Parser from 'html-react-parser';

@observer class Credits extends Component {
  constructor(props) {
    super(props);

    this.state = {title: ''};
  }

  render() {
    const creditsLabelClassName = !!this.props.recordFormStore.record.errors_on_publishing['credit'] ? "errors-on-publish" : "";
    let credit = this.props.recordFormStore.record.credit || "";
    // if(description.length) {
    //   description = description.map((el) => el.props.children).join("\n").replace(/^\n/,'');
    // }else {
    //   console.log(description);
    // }

    return (
      <div>
        <div className="form-group form-group--credits">
          <label className={creditsLabelClassName}>Credits and attribution</label>
          <textarea rows="4" placeholder="Describe where you got this information, if it comes from elsewhere" name="credit" value={credit} onChange={this.handleOnChange} onBlur={this.handleOnBlur} className={`${this.appendErrorClassNameToField('credit')}`}>
          </textarea>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Credits);
