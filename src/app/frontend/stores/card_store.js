import {observable} from 'mobx';

import MapViewStore from './map_view_store';
import CardModel from '../models/card_model';
import faker from 'faker';

export default class CardStore {
  @observable cards = [];

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
   * Given a Card instance that is is the parent of a collection of records, we need to return a store of its records
   *
   * @param card - Collection with .records
   */
  static fromCollectionCard(card) {
    const store = CardStore.fromJS(card.records);

    return store;
  }
}
