import React, {Component} from 'react';

export default class Map extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>this is jsx<br/>name Prop: {this.props.name}</div>;
  }
}