import React,{Component} from 'react';

export default class RecordFormComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);
        this.handleOnChange = this.handleOnChange.bind(this);
      }

      handleOnChange(event) {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      }

      render() {
        return super.render();
      }
    };

    boundClass.displayName = component.name;
    return boundClass;
  }
}
