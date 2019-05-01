import React, {Component} from 'react';
import {observer} from "mobx-react";
import axios from 'axios';

@observer export default class GeoreferencedLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const state = {...this.state};
    state.loading = true;
    this.props.layer.is_loading = true;
    axios.get('/collections?everyone=true&per_page=1').then((response) => {
      this.props.layer.is_loading = false;
      state.data = response.data;
    }).finally(() => {
      this.setState(state);
    }).catch((error) => {
      console.log("Error!");
    });
  }

  render() {
    if(this.state.loading) {
      return <span>...</span>
    }else if(this.state.data) {
      return <div>
        ok
      </div>
    }else {
      return <React.Fragment/>
    }
  }
}
