import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styles = {border: '1px solid #ccc', margin: '10px'};

    if( this.props.card.highlighted ) {
      styles.background = 'red';
    }

    return (
      <div id="record-card-container" style={styles} onMouseEnter={()=>this.props.card.highlighted=true} onMouseOut={()=>this.props.card.highlighted=false}>
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
