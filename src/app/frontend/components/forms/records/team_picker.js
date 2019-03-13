import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";
import Team from "../../../sources/team";
import Select from 'react-select';

@observer class TeamPicker extends Component {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();
    this.state = {
      record: this.props.recordFormStore.record,
      allow_team_editing: this.props.recordFormStore.record.allow_team_editing,
      teams: []
    }
  }

  componentWillMount() {
    let teams = [];
    Team.index().then((response) => {
      teams = response.data.map((team) => ({value: team.id, label: team.name}));
      this.setState({teams: teams});
    });

  }

  componentWillReceiveProps() {
    this.setState({
      record: this.props.recordFormStore.record,
      allow_team_editing: this.props.recordFormStore.record.allow_team_editing
    })
  }

  handleAllowTeamEditingOnChange(event) {
    this.setState({allow_team_editing: event.target.checked});
    this.state.record.allow_team_editing = event.target.checked;
    if (!event.target.checked) {
      this.state.record.team_id = null;
    }
  }

  handleSelectOnChange(option, event) {
    let {action} = event;

    // if a select option changes, we need to add the id to the records collection ids (which are observed in the RecordModel and persisted)
    if( action === 'select-option' ) {
      this.state.record.team_id = option.value;
    }

  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='team' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='team') ? 'is-open' : '';
    const toggled_classname = (this.state.allow_team_editing) ? "is-toggled" : "";

    return (
      <div className={`section section--assign-to-team ${pane_classname}`}>
        <h2 className="title" data-name="team" onClick={this.togglePaneVisibility}>Who can edit?</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-assign-to-team">
            <div className="form">
              <div className={`form-group form-group--toggle-switch ${toggled_classname}`}>
                <label>
                  <span>Only you</span>
                  <input type="checkbox" name='showing_collections' checked={this.state.allow_team_editing} onChange={this.handleAllowTeamEditingOnChange.bind(this)}/>
                  <span className="toggle"></span>
                  <span>You and your team</span>
                </label>
              </div>
              {
                this.state.allow_team_editing &&
                <Select placeholder='Choose a team…' options={this.state.teams} value={(this.state.record.team_id) ? this.state.teams.find((t) => t.value === this.state.record.team_id) : ""} isMulti={false} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef}/>
              }

            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(TeamPicker);
