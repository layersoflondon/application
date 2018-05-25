import {observable} from 'mobx';
import CardModel from '../models/card';
import RecordModel from '../models/record';
import CollectionModel from '../models/collection';

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
  @observable cards = []; // stores an array of CardModel objects
  title;
  description;

  // set to true if rendering a sub-collection
  root_card_store = false;

  constructor(cards = [], title = '', description = '', root_card_store = false) {
    this.cards = cards;
    this.title = title;
    this.description = description;
    this.root_card_store = root_card_store; // is this the root of the tray (nowhere to navigate up to)
  }

  // todo: make this method update a record's marker after it is persisted. Refactor CardModel.fromJS
  // to either support creating its proper object type (collection or record) or just call CardModel.new and
  insertOrUpdateRecord(record) {
    const cards = this.cards.slice();
    let collection_card = null;
    let collection_record = null;

    const card = cards.find((c) => {
      if( c.is_collection ) {
        collection_card = c;
        collection_record = c.records.find((r) => r.id === record.id);

        if( collection_record ) {
          return collection_record;
        }else {
          collection_card = null;
        }
      }

      collection_card = null;
      return c.id === record.id;
    });

    if( card && !collection_card) {
      const index = cards.indexOf(card);
      const tray_card = new CardModel(record);
      cards[index] = tray_card;
      this.cards = cards;
    }else if( card && collection_card) {
      const index = cards.indexOf(collection_card);
      const record_index = collection_card.records.indexOf(collection_record);
      const collection_records = collection_card.records.slice();

      collection_records[record_index] = record;
      collection_card.records = collection_records;
      cards[index] = collection_card;
      this.cards = cards;
    }else {
      cards.unshift(new CardModel(record));
      this.cards = cards;
    }
  }

  /**
   * return an instance of the store populated with the array of Card objects
   * @param object
   */
  static fromJS(object) {
    const store = new CardStore();

    const cards = object.cards.map((card_object) => {
      if( card_object.hasOwnProperty('records') ) {
        return new CollectionModel.fromJS(card_object);
      }else {
        return new RecordModel.fromJS(card_object);
      }
    });

    Object.assign(store, object);
    store.cards = cards.map((card) => new CardModel(card));

    return store;
  }
}
