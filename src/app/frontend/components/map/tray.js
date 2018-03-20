import React,{Component} from 'react';

import {observer} from "mobx-react";

import CardStore from '../../stores/card_store';

import Card from './card';

@observer class Tray extends Component {
  constructor(props) {
    super(props);
  }

  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);

    const cards = Array(count).fill().map((_, i) => {
      const create_card = (i) => ({
        id: i,
        name: faker.commerce.productName(),
        record: {id: i, name: faker.commerce.productName()}
      });

      return create_card(faker.random.number());
    });

    cards.map( (c) => CardStore.all_cards.push(c) );
  }

  render() {
    const cards = CardStore.cards.map( (c) => {return <Card key={c.id} card={c} />});

    return <div id="tray-container" style={{position: 'relative'}}>
      {cards}

      <div style={{position: 'absolute', left: '10px', bottom: '10px'}}>
        <button onClick={this.addCards.bind(this)} data-add="1">+ Add 1 card</button>
        <button onClick={this.addCards.bind(this)} data-add="5">+ Add 5 cards</button>
        <button>Move map</button>
        <button>Bounce Pin of first record</button>
      </div>
    </div>;
  }
}

export default Tray;
