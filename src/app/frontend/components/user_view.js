import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from 'react-router-dom';

@inject('router', 'trayViewStore', 'mapViewStore', 'recordFormStore')
@withRouter
@observer export default class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};
  }

  componentWillMount() {
    if( this.props.match && this.props.match.params.id && this.props.match.params.id === this.props.trayViewStore.user_id ) {
    }else { // dont set collection_id if we're at /collections/new
      this.props.trayViewStore.user_id = this.props.match.params.id;
    }
  }

  componentWillUnmount() {
    this.props.trayViewStore.user_id = false;
  }

  render_state_loading_true() {
    return <div></div>;
  }

  render_state_loading_false() {
    return <div></div>;
  }

  render() {
    return this[`render_state_loading_${this.props.trayViewStore.loading_user}`]();
  }
}
