import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer class Card extends Component {
  constructor(props) {
    super(props);
  }

  toggleCurrentState() {
    this.props.card.toggleCurrent();
  }

  render() {
    let styles = {};
    if( this.props.card.current ) {
      styles = {border: '1px solid red'};
    }

    return <div id="record-card-container" style={styles} onClick={this.toggleCurrentState.bind(this)}>{this.props.card.name}</div>;
  }
}

export default Card;
