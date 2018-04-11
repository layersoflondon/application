import React,{Component} from 'react';

export default class RecordFormComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.togglePaneVisibility = this.togglePaneVisibility.bind(this);
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
