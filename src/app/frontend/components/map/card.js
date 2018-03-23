import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import CardStore from "../../stores/card_store";

@observer export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    if( this.props.card.is_collection ) {
      const collectionCardStore = CardStore.fromCollectionCard(this.props.card);
      this.props.trayViewStore.cardStore = collectionCardStore;
    }
  }

  render() {
    let styles = {border: '1px solid #ccc', margin: '10px'};

    if( this.props.card.highlighted ) {
      styles.background = 'red';
    }

    let collection_label;
    if( this.props.card.is_collection ) {
      collection_label = <span style={{background: 'red', padding: '4px'}}>Collection</span>
    }

    return (
      <div onClick={this.handleClick.bind(this)} id="record-card-container" style={styles} onMouseEnter={()=>this.props.card.highlighted=true} onMouseOut={()=>this.props.card.highlighted=false}>
        <h4>
          {this.props.card.name} {collection_label}
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

Card.propTypes = {
  card: PropTypes.object.isRequired,
  // mapViewStore: PropTypes.object.isRequired
};