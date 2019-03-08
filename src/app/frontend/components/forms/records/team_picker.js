import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";

@observer class TeamPicker extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='team' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='team') ? 'is-open' : '';
    return (
      <div className={`section section--assign-to-team ${pane_classname}`}>
        <h2 className="title" data-name="team" onClick={this.togglePaneVisibility}>Assign to a team</h2>

        <div className="pane" style={pane_styles}>
          todo
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Team);
