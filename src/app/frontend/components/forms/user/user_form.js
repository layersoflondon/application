import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import { NavLink, Link, withRouter } from 'react-router-dom';
import Tabs from '../../../components/tabs';
import TeamForm from './team_form';
import RecordsCollections from './records_collections_form';
import TeachersForm from "./teachers_form";

@inject('mapViewStore', 'currentUser')
@withRouter
@observer export default class UserForm extends Component {
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
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'user_form' ) className+=" is-showing";
    const content = {
      account: <iframe width="100%" height="650" src="/users/edit" frameBorder="0" data-resizable="true"></iframe>,
      teams: <TeamForm id={this.state.id}/>,
      records: <RecordsCollections/>,
      teachers: <TeachersForm user={this.props.currentUser} />,
      sign_out: <h2>Signing you out of your account</h2>

    };

    return (
      <div className={className}>
          <div className="close">
              <Link to="/map" className="close">Close</Link>
          </div>
          <div className="m-overlay-subnavigation">
              <h1>Your Profile</h1>
              <Tabs active={this.state.active} onChange={this.setActiveTab.bind(this)}>
                  <span key="account">Account details</span>
                  <span key="teams">Teams</span>
                  <span key="records">Records & Collections</span>
                  <span key="teachers">For teachers</span>
                  <span key="sign_out">Sign out</span>
              </Tabs>
          </div>
          <div className="m-account-page-wrapper">
              {content[this.state.active]}
          </div>
      </div>
    );
  }
}
