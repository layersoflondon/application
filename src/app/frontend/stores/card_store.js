import {observable} from 'mobx';

import TrayCardData from './tray_card_data';

/**
 * Drives the data that we display in the tray, and the markers in the map.
 *
 * Set TrayViewStore's cardStore attribute to an instance of a CardStore, and the array of [cards] will
 * be displayed in the tray.
 *
 * We use this when rendering the cards, and if one of those cards is a collection, create a CardStore of the collection's
 * records and set the TrayViewStore's cardStore to the new object.
 *
 */
export default class CardStore {
  @observable cards = [];

  // set to true if rendering a sub-collection
  rootCardStore = false;

  /**
   * return an instance of the store populated with the array of Card objects
   * @param array
   */
  static fromJS(array) {
    const store = new CardStore();
    store.cards = array.map( (c) => TrayCardData.fromJS(store, c) );

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
