import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Errors extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        todo: errors template
      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Errors);
