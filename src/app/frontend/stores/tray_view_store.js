import {observable, observe} from 'mobx';
import CardStore from './card_store';
import Record from '../sources/record';
import RecordModel from '../models/record';
import Collection from '../sources/collection';
import TrayCardData from './tray_card_data';

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  // the TrayViewStore is given its datasource (the cardStore attribute) and it renders it as a list in the tray
  @observable cardStore = null;
  @observable previousCardStore = null;
  @observable visible_record_id = null;
  @observable visible_record = null;

  @observable visible_collection_id = null;

  @observable tray_is_visible = true;

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
      if( change.newValue ) {
        Record.show(null, this.visible_record_id).then((response) => {
          const record = RecordModel.fromJS(response.data);
          this.visible_record = record;
        }).catch((error) => {
          this.visible_record = null;
        });
      }else {
        // console.log("No newValue in visible_record_id change", change);
        this.visible_record = null;
      }
    });

    observe(this, 'visible_collection_id', (change) => {
      if( change.newValue ) {
        Collection.show(null, this.visible_collection_id).then((response) => {
          const collection_card_data  = TrayCardData.fromJS(response.data, this.visible_collection_id);
          collection_card_data.cards = collection_card_data.records;
          delete collection_card_data['records'];

          this.cardStore = CardStore.fromJS(collection_card_data);
        }).catch((error) => {
          console.log("Error fetching collection", error);
          this.visible_collection_id = null;
        });
      }else {
        // console.log("No newValue in visible_collection_id change", change);
        this.visible_collection_id = null;
      }
    });

    // swapping the cardStore will re-render the tray with the new array of records
    observe(this, 'cardStore', (change) => {
      this.previousCardStore = change.oldValue;
    });
  }

  toggleTrayVisibility(event) {
    this.tray_is_visible = !this.tray_is_visible;
  }

  moveToNextCard() {
    const current_card = this.cardStore.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.cardStore.cards.indexOf(current_card);

    const next_cards = this.cardStore.cards.slice(current_index+1);
    const next_card = next_cards.find((c) => !c.is_collection);

    if( next_card ) {
      this.visible_record_id = next_card.id;
    }
  }

  moveToPreviousCard() {
    const current_card = this.cardStore.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.cardStore.cards.indexOf(current_card);

    const previous_cards = this.cardStore.cards.slice(0, current_index).reverse();
    const previous_card = previous_cards.find((c) => !c.is_collection);

    if( previous_card ) {
      this.visible_record_id = previous_card.id;
    }
  }

  static fromJS(tray_view_state) {
    let store = new TrayViewStore();

    if(tray_view_state.hasOwnProperty('cardStore')) {
      const card_store_data = tray_view_state.cardStore;
      delete tray_view_state['cardStore'];

      store.cardStore = CardStore.fromJS(card_store_data, true);
    }

    if(tray_view_state.hasOwnProperty('previousCardStore') && tray_view_state.previousCardStore) {
      const previous_card_store_data = tray_view_state.previousCardStore;
      delete tray_view_state['previousCardStore'];

      store.previousCardStore = CardStore.fromJS(previous_card_store_data);
      store.cardStore.rootCardStore = false;
    }

    if(tray_view_state.visible_record_id) {
      const record_state = tray_view_state.visible_record;
      delete tray_view_state['visible_record_id'];
      delete tray_view_state['visible_record'];

      store.visible_record    = RecordModel.fromJS(record_state);
      store.visible_record_id = record_state.id;
    }

    Object.assign(store, tray_view_state);

    return store;
  }
}
