import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from 'react-router-dom';

@inject('router', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer export default class TeamView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    if( this.props.match && this.props.match.params.id && this.props.match.params.id === this.props.trayViewStore.team_id ) {
    } else {
      this.props.trayViewStore.team_id = this.props.match.params.id;
    }
  }

  componentWillUnmount() {
    this.props.trayViewStore.team_id = false;
  }

  render_state_loading_true() {
    return <div></div>;
  }

  render_state_loading_false() {
    return <div></div>;
  }

  render() {
    return this[`render_state_loading_${this.props.trayViewStore.loading_team}`]();
  }
}
