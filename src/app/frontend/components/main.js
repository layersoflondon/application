import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './map/tools';
import Tray from './map/tray';
import MapView from './map/map_view';

@observer export default class Main extends Component {
  constructor(props) {
    super(props);
    this.mapViewRef = null;
  }

  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);
    this.props.cardStore.addCards(count);
  }

  moveMap(event) {
    // move the map to a random card's record
    const card = this.props.cardStore.cards[Math.floor(Math.random() * cardStore.cards.length)];
    this.props.mapViewStore.center = card.record.position;
  }

  bindMapView(component) {
    window._map = component.refs.map;
  }

  render() {
    return <div className="m-map-wrapper" id="main-container">
      <Devtools />

      <div style={{position: 'fixed', zIndex: '99999', right: '20px', top: '40px', padding: '10px', background: '#ccc'}}>
        <button onClick={this.addCards.bind(this)} data-add="1">+ Add 1 card</button>
        <button onClick={this.addCards.bind(this)} data-add="5">+ Add 5 cards</button>
        <button onClick={this.moveMap.bind(this)}>Move map</button>
      </div>

      <Tools />

      <MapView cardStore={this.props.cardStore} mapViewStore={this.props.mapViewStore} ref={this.bindMapView.bind(this)} />
      <Tray cardStore={this.props.cardStore} />
    </div>
  }
}

Main.propTypes = {
  cardStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
