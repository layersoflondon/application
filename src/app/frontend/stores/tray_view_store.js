import {observable, observe} from 'mobx';
import Record from '../sources/record';
import Collection from '../sources/collection';

import CardModel from '../models/card';

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  // the TrayViewStore is given its data source (the cards attribute) and it renders it as a list in the tray
  @observable tray_is_visible = true;

  @observable cards = observable.map();
  @observable collection_store = null;

  @observable title = null;
  @observable description = null;

  @observable record = null; //the record we're viewing or editing
  @observable collection = null; //the collection we're viewing

  @observable loading_record = false;
  @observable loading_collection = false;
  @observable record_id = null;
  @observable collection_id = null;

  // dom reference to the leaflet element
  map_ref = null;

  constructor() {
    observe(this, 'cards', (change) => {
      this.previousCards = change.oldValue;
    });

    observe(this, 'tray_is_visible', (change) => {
      // force leaflet to re-draw its layout so we can resize the mapview and it retains full-width of the container
      setTimeout(() => {
        this.map_ref.leafletElement.invalidateSize();
      }, 100);
    });

    // mutating the visible_record_id will fetch that record and update the RecordView component with the relevant state
    observe(this, 'record_id', (change) => {
      this.loading_record = true;

      if( change.newValue ) {
        if(this.cards.get(`record_${change.newValue}`)) {
          let card = this.cards.get(`record_${change.newValue}`);
          this.record = card.data;
          this.loading_record = false;
        }else {
          Record.show(null, this.record_id).then((response) => {
            let card = CardModel.fromJS(response.data, this);
            this.cards.set(card.id, card);
            this.record = card.data;
          }).catch((error) => {
            console.log("Error getting record", error);
            this.record_id = null;
          }).finally(() => {
            this.loading_record = false;
          });
        }
      }else {
        this.record = null;
        this.loading_record = false;
      }
    });

    observe(this, 'collection_id', (change) => {
      this.loading_collection = true;
      console.log("Get collection");

      if( change.newValue ) {
        Collection.show(null, this.collection_id).then((response) => {
          console.log(response.data);
          this.showCollectionOfRecords(response.data.records, response.data.title, response.data.description);
        }).catch((error) => {
          console.log("Error getting collection", error, this.collection_id);
          this.collection_id = null;
        }).finally(() => {
          this.loading_collection = false;
        });
      }else {
        // console.log("No newValue in collection_id change", change);
        this.collection_id = null;
        this.loading_collection = false;
      }
    });
  }

  toggleTrayVisibility(event) {
    this.tray_is_visible = !this.tray_is_visible;
  }

  moveToNextCard() {
    // const current_card = this.card_store.cards.find((c) => c.id === this.visible_record_id);
    // const current_index = this.card_store.cards.indexOf(current_card);
    //
    // const next_cards = this.card_store.cards.slice(current_index+1);
    // const next_card = next_cards.find((c) => !c.is_collection);
    //
    // if( next_card ) {
    //   console.log("Setting visible_record_id");
    //   this.visible_record_id = next_card.id;
    // }
  }

  moveToPreviousCard() {
    // const current_card = this.card_store.cards.find((c) => c.id === this.visible_record_id);
    // const current_index = this.card_store.cards.indexOf(current_card);
    //
    // const previous_cards = this.card_store.cards.slice(0, current_index).reverse();
    // const previous_card = previous_cards.find((c) => !c.is_collection);
    //
    // if( previous_card ) {
    //   console.log("Setting visible_record_id");
    //   this.visible_record_id = previous_card.id;
    // }
  }

  /**
   * replace the current collection of cards with the given data
   *
   * @param card_data
   * @param title
   * @param description
   */
  showCollectionOfRecords(card_data, title = null, description = null) {
    // this.title = title;
    // this.description = description;

    this.cards = observable.map();

    card_data.map((data) => {
      const card = CardModel.fromJS(data, this);
      this.cards.set(card.id, card);
    });
  }

  /**
   * build a new TrayViewStore instance from the given data
   *
   * @param card_data
   * @param title
   * @param description
   * @returns {TrayViewStore}
   */
  static fromJS(card_data, title = null, description = null) {
    let store = new TrayViewStore();

    store.title = title;
    store.description = description;

    card_data.map((data) => {
      const card = CardModel.fromJS(data, store);
      store.cards.set(card.id, card);
    });

    return store;
  }

  /**
   * Once a record has been persisted, push its updated version onto the cards store
   * @param data
   * @returns {*}
   */
  addOrUpdateRecord(data) {
    const card = CardModel.fromJS(data, this);
    this.cards.set(card.id, card);

    return card;
  }
}
