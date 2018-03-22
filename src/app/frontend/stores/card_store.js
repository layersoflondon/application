import {observable} from 'mobx';
import CardModel from '../models/card_model';
import faker from 'faker';

window.faker = faker;

export default class CardStore {
  @observable cards = [];

  /**
   * TODO: remove this - just for dev to debug rendering
   * @param count
   */
  addCards(count) {
    const create_card = (i) => {
      let position = [(51 + Math.random() * 1), (Math.floor(Math.random()*100)/100) - 0.5];
      let record = {id: i, name: faker.commerce.productName(), position: position};

      return {id: i, name: faker.commerce.productName(), description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, records: [record]};
    };

    const cards = Array(count).fill().map( (_, i) => create_card(faker.random.number() ) );

    cards.map( (c) => {this.cards.push( new CardModel( this, c ) ) });
  }

  /**
   * return an instance of the store populated with the array of Card objects
   * @param array
   */
  static fromJS(array) {
    const store = new CardStore();
    store.cards = array.map( (c) => CardModel.fromJS(store, c) );

    console.log("settings store card: ", store.cards);
    return store;
  }
}
