import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './map/tools';
import Tray from './map/tray';
import MapView from './map/map_view';
import RecordView from './map/record_view';

@observer export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);
    this.props.cardStore.addCards(count);
  }

  removeCard(){
    this.props.cardStore.removeCard();
  }

  setMapViewCards() {
    const cards = this.props.cardStore.cards;
    this.props.mapViewStore.records = cards;
  }

  componentDidUpdate() {
    console.log("did update")
  }

  render() {
    return <div className="m-map-wrapper" id="main-container">
      <Devtools />

      <div style={{position: 'fixed', zIndex: '99999', right: '20px', top: '40px', padding: '10px', background: '#ccc'}}>
        <button onClick={this.addCards.bind(this)} data-add="1">+ Add 1 card</button>
        <button onClick={this.addCards.bind(this)} data-add="5">+ Add 5 cards</button>
        <button onClick={this.removeCard.bind(this)}>- Remove card</button>
      </div>

      <Tools />

      <MapView cardStore={this.props.cardStore} mapViewStore={this.props.mapViewStore} />
      <Tray cardStore={this.props.cardStore} mapViewStore={this.props.mapViewStore} />
    </div>
  }
}

Main.propTypes = {
  cardStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
