import React, {Component} from 'react';


export default class Map extends Component {
  constructor(props) {
    super(props);
    console.log("This is thee Map class, exported as the default module from components/map/map.js", props);
  }

  render() {
    return <div>this is jsx<br/>name Prop: {this.props.name}</div>;
  }
}