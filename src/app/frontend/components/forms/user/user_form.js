import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import { NavLink, Link, withRouter } from 'react-router-dom';
import Tabs from '../../../components/tabs';
import TeamForm from './team_form';
import RecordsCollections from './records_collections_form';
import TeachersForm from "./teachers_form";

@inject('mapViewStore')
@withRouter
@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    // this.state = {};
    this.state = {active: 'account'};
  }

  componentWillMount() {
    this.setState({
      active: this.props.match.params.tab,
      id: this.props.match.params.id
    });
  }

  setActiveTab(active) {
    // active => this.setState({active})
    this.setState({active: active});
      if (active == "sign_out") {
          window.location = "/users/sign_out";

      } else {
        history.pushState({}, '', `/map/account/${active}`);
      }
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
      account: <iframe width="100%" height="650" src="/users/edit" frameBorder="0"></iframe>,
      teams: <TeamForm id={this.state.id}/>,
      records: <RecordsCollections/>,
      teachers: <TeachersForm/>,
      sign_out: <h2>Signing you out of your account</h2>

    };
    //TODO - we need to use meta tags to define the routes which we load into the iframe

    return (
      <div className={className}>
          <div className="s-overlay--your-account--details is-showing">
              <div className="close">
                  <Link to="/map" className="close">Close</Link>
              </div>
              <div className="m-overlay-subnavigation">
                  <Tabs active={this.state.active} onChange={this.setActiveTab.bind(this)}>
                      <span key="account">Account details</span>
                      <span key="teams">Teams</span>
                      <span key="records">Records & Collections</span>
                      {/*<span key="teachers">For teachers</span>*/}
                      <span key="sign_out">Sign out</span>
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
