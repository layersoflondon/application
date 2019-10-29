import React,{Component} from 'react';
import RecordFormComponentState from '../records/record_form_component_state';
import {observer} from "mobx-react";

@observer class Tag extends Component {
  render() {
    return <li className="child-tag">
      <label>
        <input id={this.props.id} value={1} type="checkbox" checked={this.props.tagIsChecked} onChange={(event) => this.props.inputClicked(event)} />
        {this.props.name}
      </label>
    </li>
  }
}

export default RecordFormComponentState.bindComponent(Tag);
