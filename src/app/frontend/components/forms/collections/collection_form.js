import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";

@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {name: "", description: "", read_state: false, edit_state: "user", team_id: null};
  }

  handleOnChange(event) {
    let state_value;
    let { name, value } = event.target;

    console.log(event.target.type, value, typeof value);
    switch(event.target.type) {
      case "checkbox":
        state_value = value != "false";
        break;
      default:
        state_value = value;
        break;
    }

    this.setState({
      [name]: state_value
    });
  }

  handleOnSubmit(event) {
    event.preventDefault();
    console.log("Handle submit", event, this.state);
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'collection_form' ) className+=" is-showing";

    return (
      <div className={className}>
        <div className="s-overlay--add-collection is-showing">

          <div className="close">
            <button className="close" onClick={()=>this.props.mapViewStore.overlay=null}>Close</button>
          </div>

          <div className="m-add-collection">

            <h1>Create collection</h1>

            <form className="form--chunky form--over-white" onSubmit={this.handleOnSubmit.bind(this)}>
              <div className="form-group">
                <label>Name</label>
                <input placeholder="" type="text" name="name" value={this.state.name} onChange={this.handleOnChange.bind(this)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="10" placeholder="" name="description" value={this.state.description} onChange={this.handleOnChange.bind(this)}>
                </textarea>
              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can see?</span>
                <label>
                  <input type="checkbox" name="read_state" value={this.state.read_state} onChange={this.handleOnChange.bind(this)} />
                  <span>Keep this collection private <br /> Only you will see this collection (NB: the records within will still be visible)</span>
                </label>

              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can edit?</span>
                <label>
                  <input type="radio" name="edit_state" checked={this.state.edit_state=="user"} value="user" onChange={this.handleOnChange.bind(this)} /><span>Just you</span>
                </label>
                <label>
                  <input type="radio" name="edit_state" checked={this.state.edit_state=="team"} value="team" onChange={this.handleOnChange.bind(this)} /><span>Members of</span>
                    <select className="in-context-input" placeholder="Team" name="team_id" onChange={this.handleOnChange.bind(this)} disabled={this.state.edit_state!="team"}>
                      <option checked={this.state.team_id == "1"} onChange={this.handleOnChange.bind(this)}>Team One</option>
                      <option checked={this.state.team_id == "2"} onChange={this.handleOnChange.bind(this)}>Team Two</option>
                      <option checked={this.state.team_id == "3"} onChange={this.handleOnChange.bind(this)}>Team Three</option>
                    </select>
                </label>
                <label>
                  <input type="radio" name="edit_state" checked={this.state.edit_state=="public"} value="public" onChange={this.handleOnChange.bind(this)} /><span>Anyone</span>
                </label>
              </div>

              <input value="Save" type="submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
