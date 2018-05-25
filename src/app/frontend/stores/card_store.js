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
  title;
  description;

  // set to true if rendering a sub-collection
  root_card_store = false;

  constructor(cards = [], title = '', description = '', root_card_store = false) {
    this.cards = cards;
    this.title = title;
    this.description = description;
    this.root_card_store = root_card_store
  }

  addRecords(record_store) {
    record_store.records.map((r) => {
      this.cards.push(TrayCardData.fromJS(r));
    });
  }

  addCollections(collection_store) {
    collection_store._collections.map((c) => {
      this.cards.push(TrayCardData.fromJS(c));
    });
  }

  insertOrUpdateRecord(record) {
    const cards = this.cards.slice();
    let collection = null;

    const card = cards.find((c) => {
      if( c.is_collection ) {
        collection = c;
        return c.records.map((r) => r.id === record.id);
      }

      collection = null;
      return c.id === record.id
    });

    if( card && !collection) {
      const index = cards.indexOf(card);
      const tray_card = TrayCardData.fromJS(record.toJS());
      cards[index] = tray_card;
    }else if( card && collection) {
      console.log("Card was member of a collection", collection);
    }else {
      cards.unshift(TrayCardData.fromJS(record.toJS()));
    }

    this.cards = cards;
  }

  /**
   * return an instance of the store populated with the array of Card objects
   * @param object
   */
  static fromJS(object) {
    const store = new CardStore();

    Object.assign(store, object);

    if( !object.hasOwnProperty('cards') ){
      store.cards = [];
    }else {
      store.cards = object.cards.map( (c) => TrayCardData.fromJS(c) );
    }

    return store;
  }

  /**
   * Given a Card instance that is is the parent of a collection of records, we need to return a store of its records
   *
   * @param card - Collection with .records
   */
  static fromCollectionCard(object) {
    const store = new CardStore(object.records, object.title, object.description, false);
    Object.assign(store, object);

    return store;
  }
}
