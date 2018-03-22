import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  toggleHighlightedState(event) {
    this.setState({highlighted: !this.state.highlighted});
  }

  toggleActiveState(event) {
    this.props.card.toggleActive();
  }

  render() {
    let styles = {border: '1px solid #ccc', margin: '10px'};

    if( this.state.highlighted ) {
      styles.background = 'red';
    }

    return (
      <div id="record-card-container" style={styles} onClick={this.toggleActiveState.bind(this)} onMouseOver={this.toggleHighlightedState.bind(this)} onMouseOut={this.toggleHighlightedState.bind(this)}>
        <h4>
          {this.props.card.name}
        </h4>

        <span>{this.props.card.period}</span>
        <p>
          {this.props.card.description}
        </p>

        <img src="//placehold.it/180x180" alt="" />
      </div>
    );
  }
}
