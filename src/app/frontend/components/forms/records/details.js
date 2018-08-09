import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import PlaceDetails from './place_details';
import {observer} from 'mobx-react';
import Parser from 'html-react-parser';

@observer class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {title: ''};
  }

  render() {
    let description = this.props.recordFormStore.record.description;
    // if(description.length) {
    //   description = description.map((el) => el.props.children).join("\n").replace(/^\n/,'');
    // }else {
    //   console.log(description);
    // }

    return (
      <div>
        <div className="form-group form-group--title">
          <label>Title</label>
          <input type="text" name="title" value={this.props.recordFormStore.record.title} onChange={this.handleOnChange} onBlur={this.createDraftRecord} className={`${this.appendErrorClassNameToField('title')}`} />
        </div>

        <PlaceDetails {...this.props} />

        <div className="form-group form-group--description">
          <label>Description</label>
          <textarea rows="10" placeholder="" name="description" value={description} onChange={this.handleOnChange} className={`${this.appendErrorClassNameToField('description')}`}>
          </textarea>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Details);
