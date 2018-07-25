import React,{Component} from 'react';
import Record from '../../../sources/record';

export default class RecordFormComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);

        this.createDraftRecord = this.createDraftRecord.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.togglePaneVisibility = this.togglePaneVisibility.bind(this);
        this.appendErrorClassNameToField = this.appendErrorClassNameToField.bind(this);
      }

      createDraftRecord(event) {
        this.props.recordFormStore.record.persist().then((response) => {
          this.props.recordFormStore.record.id = response.data.id;
        }).catch((error) => {
            this.props.recordFormStore.record.errors = error.response.data;
        });
      }

      handleOnChange(event) {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });

        console.log(event);

        this.props.recordFormStore.record[name] = value;
      }

      appendErrorClassNameToField(fieldName, classes="") {
          if (this.inputErrors(fieldName).length) {
              classes += " has-errors";
          }
          return classes;
      }

      inputErrors(inputName) {
          if (this.props.recordFormStore.record.errors[inputName]) {
              return this.props.recordFormStore.record.errors[inputName];
          } else {
              return [];
          }
      }

      togglePaneVisibility(event) {
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
