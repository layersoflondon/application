import {observable} from 'mobx';
import faker from 'faker';
import CardModel from '../models/card_model';

window.faker = faker;

export default class CardStore {
  @observable cards = [];

  constructor() {
    // TODO: remove this. conditionally instantiate cards from json in page
    const demo_cards = [
      {
        id: 1,
        name: `${faker.commerce.productName()}`,
        description: faker.lorem.paragraphs(2),
        image: faker.image.dataUri(),
        period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
        record: {id: 1, name: `${faker.commerce.productName()} record!`, position: [51.1, -0.11]}
      },
      {
        id: 2,
        name: `${faker.commerce.productName()}`,
        description: faker.lorem.paragraphs(2),
        image: faker.image.dataUri(),
        period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
        record: {id: 2, name: `${faker.commerce.productName()} record!`, position: [51.2, -0.12]}
      },
      {
        id: 3,
        name: `${faker.commerce.productName()}`,
        description: faker.lorem.paragraphs(2),
        image: faker.image.dataUri(),
        period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
        record: {id: 3, name: `${faker.commerce.productName()} record!`, position: [51.3, -0.13]}
      },
      {
        id: 4,
        name: `${faker.commerce.productName()}`,
        description: faker.lorem.paragraphs(2),
        image: faker.image.dataUri(),
        period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
        record: {id: 4, name: `${faker.commerce.productName()} record!`, position: [51.4, -0.14]}
      }
    ];

    demo_cards.map( (dc) => {
      this.cards.push(new CardModel( this, dc ));
    });
  }

  /**
   * TODO: remove this - just for dev to debug rendering
   * @param count
   */
  addCards(count) {
    const create_card = (i) => {
      let position = [(51 + Math.random() * 1), (Math.floor(Math.random()*100)/100) - 0.5];
      let record = {id: i, name: faker.commerce.productName(), position: position};

      return {id: i, name: faker.commerce.productName(), description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, record: record};
    };

    const cards = Array(count).fill().map( (_, i) => create_card(faker.random.number() ) );
    cards.map( (c) => {this.cards.push(c) });
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
}
