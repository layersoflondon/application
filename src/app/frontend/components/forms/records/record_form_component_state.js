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
      }

      createDraftRecord(event) {
        if( !this.props.recordFormStore.id ) {
          console.log("Create draft record!");
          this.props.recordFormStore.id = 1;
        }else {
          console.log("Already got id for this record");
        }
      }

      handleOnChange(event) {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
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
