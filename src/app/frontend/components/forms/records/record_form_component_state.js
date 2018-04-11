import React,{Component} from 'react';
import PropTypes from 'prop-types';

export default class RecordFormComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
      }

      handleChange(event) {
        let state = {};
        state[event.target.dataset.name] = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;

        super.setState(state);
      }

      render() {
        return super.render();
      }
    };

    boundClass.displayName = component.name;
    return boundClass;
  }
}

RecordFormComponentState.propTypes = {
  mapViewStore: PropTypes.object.is_required,
  recordFormStore: PropTypes.object.is_required,
};
