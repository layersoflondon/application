import {observable, observe, computed} from 'mobx';
import Record from '../sources/record';
import Collection from '../sources/collection';

import CardModel from '../models/card';
import axios from 'axios';
import Search from "../sources/search";

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  root = true;
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

  constructor() {
    observe(this, 'cards', (change) => {
      this.previous_cards = change.oldValue;
    });

    observe(this, 'tray_is_visible', (change) => {
      // force leaflet to re-draw its layout so we can resize the mapview and it retains full-width of the container
      setTimeout(() => {
        this.props.mapViewStore.map_ref.leafletElement.invalidateSize();
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
      if( change.newValue ) {
        this.loading_collection = true;
        console.log("Get collection", change.newValue);
        Collection.show(null, this.collection_id).then((response) => {
          this.root = false;
          this.showCollectionOfRecords(response.data.records, response.data.title, response.data.description);
          // this.panTo(response.data.records[0])
        }).catch((error) => {
          console.log("Error getting collection", error, this.collection_id);
          this.collection_id = null;
        }).finally(() => {
          this.loading_collection = false;
        });
      }else {
        console.log("No newValue in collection_id change", change);
        this.collection_id = null;
        this.loading_collection = false;
      }
    });
  }

  toggleTrayVisibility(event) {
    this.tray_is_visible = !this.tray_is_visible;
  }

  /**
   * perform a search using just the current visible bounds of the map. this will be called
   * whenever the user drags or zooms the map in order to show relevant markers
   *
   * @param bounds
   */
  reloadTrayDataForBounds(bounds) {
    console.log("Reloading tray data for bounds", bounds);
    Search.perform({geobounding: bounds}).then((response) => {
      console.log(`Got ${response.data.length} records`);
      this.showCollectionOfRecords(response.data);
    });
  }

  panTo(lat, lng, zoom = null) {
    this.initial_position = this.center;
    this.center = [lat, lng];

    if(zoom) {
      this.zoom = zoom;
    }
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

  restoreState() {
    if( !this.root && this.previous_cards ) {
      this.cards = this.previous_cards;
      this.previous_cards = null;
    }
  }

  /**
   * What we should render when the user hits the /map route
   */
  fetchInitialState() {
    axios.get('/map/state.json').then((response) => {
      this.showCollectionOfRecords(response.data.data.tray.cards);
    });
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

    let cards = observable.map();
    card_data.map((data) => {
      const card = CardModel.fromJS(data, this);
      cards.set(card.id, card);
    });

    this.cards = cards;
  }

  /**
   * build a new TrayViewStore instance from the given data
   *
   * @param tray_data
   * @returns {TrayViewStore}
   */
  static fromJS(tray_data) {
    let store = new TrayViewStore();

    store.title = tray_data.title;
    store.description = tray_data.description;

    tray_data.cards.map((data) => {
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
