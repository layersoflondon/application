import React,{Component} from 'react';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);
    this.props.cardStore.addCards(count);
  }

  render() {
    const {cardStore} = this.props;
    const cards = cardStore.cards.map( (c) => {return <Card key={c.id} card={c} />});

    return <div id="tray-container" style={{position: 'relative', marginTop: '100px'}}>
      {cards}

      <div style={{position: 'fixed', left: '10px', top: '40px', padding: '10px', background: '#ccc'}}>
        <button onClick={this.addCards.bind(this)} data-add="1">+ Add 1 card</button>
        <button onClick={this.addCards.bind(this)} data-add="5">+ Add 5 cards</button>
        <button>Move map</button>
        <button>Bounce Pin of first record</button>
      </div>
    </div>;
  }
}
