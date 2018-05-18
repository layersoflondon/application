import React,{Component} from 'react';
import {observer} from "mobx-react";
import Tabs from '../../../components/tabs';
import TeamForm from './team_form';
import RecordsCollections from './records_collections_form';
import TeachersForm from "./teachers_form";


@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    // this.state = {};
    this.state = {active: 'aTab'};
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
    if( this.props.mapViewStore.overlay === 'user_form' ) className+=" is-showing";
    const content = {
      aTab: <iframe width="100%" height="650" src="/users/edit" frameBorder="0"></iframe>,
      bTab: <TeamForm/>,
      cTab: <RecordsCollections/>,
      dTab: <TeachersForm/>
    };
    //TODO - we need to use meta tags to define the routes which we load into the iframe

    return (
      <div className={className}>
          <div className="s-overlay--your-account--details is-showing">
              <div className="close">
                  <button className="close" onClick={()=>this.props.mapViewStore.overlay=null}>Close</button>
              </div>
              <div className="m-overlay-subnavigation">
                  <Tabs
                      active={this.state.active}
                      onChange={active => this.setState({active})}
                  >
                      <span key="aTab">Account details</span>
                      <span key="bTab">Teams</span>
                      <span key="cTab">Records & Collections</span>
                      <span key="dTab">For teachers</span>
                  </Tabs>
              </div>
              <div className="m-account-page m-account-page--details">
                  {content[this.state.active]}
              </div>
          </div>
      </div>
    );
  }
}
