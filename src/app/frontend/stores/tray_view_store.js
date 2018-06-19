import {observable, observe} from 'mobx';
import CardStore from './card_store';
import Record from '../sources/record';
import RecordModel from '../models/record';
import CardModel from '../models/card';
import Collection from '../sources/collection';
import CollectionModel from '../models/collection';

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  // the TrayViewStore is given its data source (the card_store attribute) and it renders it as a list in the tray
  @observable card_store = null;
  @observable previous_card_store = null;
  @observable tray_is_visible = true;

  @observable loading_record = false;
  @observable visible_record_id = null;
  @observable visible_record = null;

  @observable loading_collection = false;
  @observable visible_collection_id = null;
  @observable visible_collection = null;

  // dom reference to the leaflet element
  map_ref = null;

  constructor() {
    observe(this, 'tray_is_visible', (change) => {
      // force leaflet to re-draw its layout so we can resize the mapview and it retains full-width of the container
      setTimeout(() => {
        this.map_ref.leafletElement.invalidateSize();
      }, 100);
    });

    // mutating the visible_record_id will fetch that record and update the RecordView component with the relevant state
    observe(this, 'visible_record_id', (change) => {
      this.loading_record = true;

      if( change.newValue ) {
        Record.show(null, this.visible_record_id).then((response) => {
          const record = RecordModel.fromJS(response.data);
          this.visible_record = record;
        }).catch((error) => {
          console.log("Error getting record", error);
          this.visible_record_id = null;
        }).finally(() => {
          this.loading_record = false;
        });
      }else {
        this.visible_record = null;
        this.loading_record = false;
      }
    });

    observe(this, 'visible_collection_id', (change) => {
      this.loading_collection = true;

      if( change.newValue ) {
        Collection.show(null, this.visible_collection_id).then((response) => {
          const collection_card_data = new CardModel(response.data); //fromJS(response.data, this.visible_collection_id);

          collection_card_data.cards = collection_card_data.records;
          delete collection_card_data['records'];

          this.visible_collection = CollectionModel.fromJS(response.data);

          console.log("about to set card_store");
          this.card_store = CardStore.fromJS(collection_card_data);
        }).catch((error) => {
          console.log("Error getting collection", error, this.visible_collection_id);
          this.visible_collection_id = null;
        }).finally(() => {
          this.loading_collection = false;
        });
      }else {
        // console.log("No newValue in visible_collection_id change", change);
        this.visible_collection_id = null;
        this.loading_collection = false;
      }
    });

    // swapping the card_store will re-render the tray with the new array of records
    observe(this, 'card_store', (change) => {
      if( change.oldValue && (change.newValue.id !== change.oldValue.id) ) {
        this.previous_card_store = change.oldValue;
      }
    });
  }

  toggleTrayVisibility(event) {
    this.tray_is_visible = !this.tray_is_visible;
  }

  moveToNextCard() {
    const current_card = this.card_store.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.card_store.cards.indexOf(current_card);

    const next_cards = this.card_store.cards.slice(current_index+1);
    const next_card = next_cards.find((c) => !c.is_collection);

    if( next_card ) {
      console.log("Setting visible_record_id");
      this.visible_record_id = next_card.id;
    }
  }

  moveToPreviousCard() {
    const current_card = this.card_store.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.card_store.cards.indexOf(current_card);

    const previous_cards = this.card_store.cards.slice(0, current_index).reverse();
    const previous_card = previous_cards.find((c) => !c.is_collection);

    if( previous_card ) {
      console.log("Setting visible_record_id");
      this.visible_record_id = previous_card.id;
    }
  }

  static fromJS(tray_view_state) {
    let store = new TrayViewStore();

    if(tray_view_state.hasOwnProperty('card_store')) {
      const card_store_data = tray_view_state.card_store;
      delete tray_view_state['card_store'];
      store.card_store = CardStore.fromJS(card_store_data);
    }

    Object.assign(store, tray_view_state);

    return store;
  }

  showCollectionOfRecords(records, title = null, description = null) {
    let store = new CardStore([], title, description, false);
    store.cards = records.map((record) => RecordModel.fromJS(record));
    this.card_store = store;
  }
}
