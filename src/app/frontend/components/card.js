import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import CardStore from "../stores/card_store";

@observer export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    if( this.props.card.is_collection ) {
      const collectionCardStore = CardStore.fromCollectionCard(this.props.card);
      this.props.trayViewStore.cardStore = collectionCardStore;
    }else {
      this.props.mapViewStore.visible_record_id = this.props.card.id;
    }
  }

  render() {
    let styles = {border: '1px solid #ccc', margin: '10px'};

    if( this.props.card.highlighted ) {
      styles.background = 'red';
    }

    return (
      <div onClick={this.handleClick.bind(this)} className="record-card-container" style={styles} onMouseEnter={()=>this.props.card.highlighted=true} onMouseOut={()=>this.props.card.highlighted=false}>
        <h4>
          {this.props.card.is_collection && <span style={{background: 'red', padding: '4px'}}>Collection</span>}
          {this.props.card.title}
        </h4>

        <span>{this.props.card.period}</span>

        <hr/>
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
