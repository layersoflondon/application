import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {observer} from "mobx-react";

@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange(event) {
    let state = {};
    state[event.target.dataset.name] = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    this.setState(state);
  }

  handleSubmit(event) {
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

            <form className="form--chunky form--over-white" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <label>Name</label>
                <input placeholder="" type="text" data-name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="10" placeholder="" data-name="description" value={this.state.description} onChange={this.handleChange.bind(this)}>
                </textarea>
              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can see?</span>
                <label>
                  <input type="checkbox" data-name="read_state" value={this.state.read_state} onChange={this.handleChange.bind(this)} />
                  <span>Keep this collection private <br /> Only you will see this collection (NB: the records within will still be visible)</span>
                </label>

              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can edit?</span>
                <label>
                  <input type="radio" defaultChecked={true} />
                    <span>Just you</span>
                </label>
                <label>
                  <input type="radio" />
                    <span>Members of</span>
                    <select className="in-context-input" placeholder="Team">
                      <option>Team One</option>
                      <option>Team Two</option>
                      <option>Team Three</option>
                    </select>
                </label>
                <label>
                  <input type="radio" />
                    <span>Anyone</span>
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
