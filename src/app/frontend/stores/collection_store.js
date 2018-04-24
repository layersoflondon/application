import {observable, observe} from 'mobx';

import TrayCardData from './tray_card_data';
import CollectionModel from "../models/collection";

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
export default class CollectionStore {
  @observable everyone_collections = [];
  @observable team_collections = [];
  @observable creator_collections = [];

  _collections = [];

  constructor() {
    observe(this, 'everyone_collections', (change) => {
      change.newValue.map((v)=>this._collections.push(v));
    });

    observe(this, 'team_collections', (change) => {
      change.newValue.map((v)=>this._collections.push(v));
    });

    observe(this, 'creator_collections', (change) => {
      change.newValue.map((v)=>this._collections.push(v));
    });
  }

  addCollection(collection_model) {
    let collection_array = this[`${collection_model.write_state}_collections`].slice();
    collection_array.push(collection_model);
    this[`${collection_model.write_state}_collections`] = collection_array;
  }
}
