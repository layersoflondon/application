import {observable, computed} from 'mobx';
import faker from 'faker';
import CardModel from '../models/card_model';

window.faker = faker;

export class CardStore {
  @observable all_cards = [
    {
      id: 1, name: `${faker.commerce.productName()}`,
      record: {id: 1, name: `${faker.commerce.productName()} record!`, position: [51.1, -0.11]}
    },
    {
      id: 2, name: `${faker.commerce.productName()}`,
      record: {id: 2, name: `${faker.commerce.productName()} record!`, position: [51.2, -0.12]}
    },
    {
      id: 3, name: `${faker.commerce.productName()}`,
      record: {id: 3, name: `${faker.commerce.productName()} record!`, position: [51.3, -0.13]}
    },
    {
      id: 4, name: `${faker.commerce.productName()}`,
      record: {id: 4, name: `${faker.commerce.productName()} record!`, position: [51.4, -0.14]}
    },
    {
      id: 5, name: `${faker.commerce.productName()}`,
      record: {id: 5, name: `${faker.commerce.productName()} record!`, position: [51.5, -0.15]}
    },
    {
      id: 6, name: `${faker.commerce.productName()}`,
      record: {id: 6, name: `${faker.commerce.productName()} record!`, position: [51.6, -0.16]}
    },
    {
      id: 7, name: `${faker.commerce.productName()}`,
      record: {id: 7, name: `${faker.commerce.productName()} record!`, position: [51.7, -0.17]}
    },
    {
      id: 8, name: `${faker.commerce.productName()}`,
      record: {id: 8, name: `${faker.commerce.productName()} record!`, position: [51.8, -0.18]}
    },
    {
      id: 9, name: `${faker.commerce.productName()}`,
      record: {id: 9, name: `${faker.commerce.productName()} record!`, position: [51.9, -0.19]}
    }
  ];

  @computed get cards() {
    // const max = 1 + Math.ceil(Math.random() * 5);
    // let ac = [];
    //
    // while(ac.length<max) {
    //   let c = this.all_cards[Math.ceil(Math.random() * this.all_cards.length)-1];
    //   if( ac.indexOf(c) === -1 ) {
    //     ac.push(c);
    //   }
    // }
    //
    // return ac;
    return this.all_cards.map( (c) => new CardModel(this, c.id, c.name, c.record, false));
  }


}

const cardStore = window.CardStore = new CardStore;
export default cardStore;
