import React,{Component} from 'react';
import Record from '../../../sources/record';
import RecordModel from "../../../models/record";

export default class RecordFormComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.togglePaneVisibility = this.togglePaneVisibility.bind(this);
        this.appendErrorClassNameToField = this.appendErrorClassNameToField.bind(this);
      }


      handleOnChange(event) {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });

        this.props.recordFormStore.record[name] = value;
      }

      createDraftRecord() {
        console.log("record_form_component_state");
      }

      handleOnBlur() {
        setTimeout(() => {this.props.recordFormStore.persistRecord()}, 1000);
      }
      appendErrorClassNameToField(fieldName, classes="") {
          if (this.inputErrors(fieldName).length) {
              classes += " has-errors";
          }
          return classes;
      }

      inputErrors(inputName) {
          if (this.props.recordFormStore.record.errors[inputName] || this.props.recordFormStore.record.errors_on_publishing[inputName]) {
              return this.props.recordFormStore.record.errors[inputName] || this.props.recordFormStore.record.errors_on_publishing[inputName];
          } else {
              return [];
          }
      }

      togglePaneVisibility(event) {
        if( !this.props.recordFormStore.record.id ) return false;
        
        if( this.props.recordFormStore.visible_pane === event.target.dataset.name ) {
          this.props.recordFormStore.visible_pane = null;
        }else {
          this.props.recordFormStore.visible_pane = event.target.dataset.name;
        }
      }

      render() {
        return super.render();
      }
    };

    boundClass.displayName = component.name;
    return boundClass;
  }
}
