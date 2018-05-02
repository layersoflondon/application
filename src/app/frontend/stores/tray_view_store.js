import {observable, observe, computed} from 'mobx';
import Record from '../sources/record';
import RecordModel from '../models/record';
import CollectionModel from '../models/collection';
import CardStore from '../stores/card_store';
import CollectionStore from './collection_store';
import RecordStore from '../stores/record_store';

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  // the TrayViewStore is given its datasource (the cardStore attribute) and it renders it as a list in the tray
  @observable cardStore = null;
  previousCardStore = null;
  @observable visible_record_id = null;
  @observable visible_record = null;
  @observable tray_is_visible = true;

  // dom reference to the leaflet element
  map_ref = null;

  constructor() {
    // swapping the cardStore will re-render the tray with the new array of records
    observe(this, 'cardStore', (change) => {
      console.log(change.oldValue);
      this.previousCardStore = change.oldValue;
    });

    // mutating the visible_record_id will fetch that record and update the RecordView component with the relevant state
    observe(this, 'visible_record_id', (change) => {
      if( change.newValue ) {
        Record.show(null, this.visible_record_id).then((response) => {
          let record = RecordModel.fromJS(response.data);
          this.visible_record = record;
        }).catch((error) => {
          this.visible_record = null;
        });
      }else {
        this.visible_record = null;
      }
    });

    observe(this, 'tray_is_visible', (change) => {
      // force leaflet to re-draw its layout so we can resize the mapview and it retains full-width of the container
      setTimeout(() => {
        this.map_ref.leafletElement.invalidateSize();
      }, 100);
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
    let tray_view_store = new TrayViewStore();
    Object.assign(tray_view_store, tray_view_state);

    return tray_view_store;
  }
}
