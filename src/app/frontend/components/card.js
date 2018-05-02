import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from "mobx-react";
import CardStore from "../stores/card_store";
import Parser from 'html-react-parser';

// @inject('routing')
@observer export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    if( this.props.card.is_collection ) {
      const collectionCardStore = CardStore.fromCollectionCard(this.props.card);
      this.props.trayViewStore.cardStore = collectionCardStore;
    }else {
      this.props.trayViewStore.visible_record_id = this.props.card.id;
    }
  }

  highlightCard() {
    this.props.card.highlighted = true;

    // // pan the map to this cards' position
    // if( !this.props.card.is_collection ) {
    //   this.props.mapViewStore.panTo(this.props.card.lat, this.props.card.lng);
    // }
  }

  render() {
    const parsed_content = Parser(this.props.card.description);

    let container_classes = "m-record-card";
    let image_styles = {background: '#2e3c4e'};

    if( this.props.card.is_collection ) container_classes += " m-record-card--collection";
    if( this.props.card.primary_image ) image_styles.backgroundImage = `url('${this.props.card.primary_image}')`;

    return (
      <div onClick={this.handleClick.bind(this)} className={container_classes} onMouseEnter={this.highlightCard.bind(this)} onMouseOut={()=>this.props.card.highlighted=false}>
        <div className="wrapper">
          <div className="image" style={image_styles}>
          </div>
          <div className="text-content">
            {this.props.card.is_collection && <span className="collection-indicator">Collection</span>}
            <h1>{this.props.card.title}</h1>

            {parsed_content[0] || parsed_content}
          </div>

          <div className="link-indicator">
          </div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  // mapViewStore: PropTypes.object.isRequired
};
