import {observable} from 'mobx';

import MapViewStore from './map_view_store';
import CardModel from '../models/card_model';
import faker from 'faker';

export default class CardStore {
  @observable cards = [];

  /**
   * TODO: remove this - just for dev to debug rendering and state
   * @param count
   */
  addCards(count) {
    const create_card = (i) => {
      let position = [(51 + Math.random() * 1), (Math.floor(Math.random()*100)/100) - 0.5];
      let record = {id: i, name: faker.commerce.productName(), description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: position};

      return {id: i, name: faker.commerce.productName(), description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, records: [record]};
    };

    const cards = Array(count).fill().map( (_, i) => create_card(faker.random.number() ) );

    cards.map( (c) => {this.cards.push( new CardModel( this, c ) ) });
  }

  /**
   * TODO: remove this - just for dev to debug rendering and state
   */
  removeCard() {
    const cards = this.cards;
    this.cards = cards.slice(1);
  }

  /**
   * return an instance of the store populated with the array of Card objects
   * @param array
   */
  static fromJS(array) {
    const store = new CardStore();
    store.cards = array.map( (c) => CardModel.fromJS(store, c) );

    return store;
  }

  /**
   * Given a Card instance, we need to return a store of Cards, built up using the initial card's
   * records
   *
   * @param card - Collection with .records
   */
  static fromCollectionCard(card) {
    const store = CardStore.fromJS(card.records);
    // store.cards = card.records.map( (c) => {
    //   let card = {
    //     id: c.id,
    //     name: c.name,
    //     description: c.description,
    //     period: c.period,
    //     image: c.image,
    //     records: [c]
    //   };
    //   return CardModel.fromJS(store, card)
    // } );

    return store;
  }
}
