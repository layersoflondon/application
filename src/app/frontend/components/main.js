import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './map/tools';
import Tray from './map/tray';
import MapView from './map/map_view';

@observer export default class Main extends Component {
  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);
    this.props.cardStore.addCards(count);
  }

  moveMap(event) {
    // move the map to a random card's record
    const card = this.props.cardStore.cards[Math.floor(Math.random() * cardStore.cards.length)];
    console.log(card);

    this.props.mapViewStore.center = card.record.position;
  }

  render() {
    return <div className="m-map-wrapper" id="main-container">
      <Devtools />

      <div style={{position: 'fixed', left: '100px', top: '20px', padding: '10px', background: '#ccc'}}>
        <button onClick={this.addCards.bind(this)} data-add="1">+ Add 1 card</button>
        <button onClick={this.addCards.bind(this)} data-add="5">+ Add 5 cards</button>
        <button onClick={this.moveMap.bind(this)}>Move map</button>
      </div>

      <Tools />

        <Tray cardStore={this.props.cardStore} />
        <MapView cardStore={this.props.cardStore} mapViewStore={this.props.mapViewStore} />
      <div id="map-container">
      </div>
    </div>
  }
}

Main.propTypes = {
  cardStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
