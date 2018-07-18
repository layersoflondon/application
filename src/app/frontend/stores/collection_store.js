import {observable, computed} from 'mobx';
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
export default class CollectionStore {
  @observable everyone_collections = observable.map();
  @observable team_collections = observable.map();
  @observable creator_collections = observable.map();

  @computed get collections() {
    let _collections = [];
    this.everyone_collections.values().map((c) => _collections.push(c));
    this.team_collections.values().map((c) => _collections.push(c));
    this.creator_collections.values().map((c) => _collections.push(c));

    return _collections;
  }

  addCollection(collection_model) {
    this[`${collection_model.write_state}_collections`].set(collection_model.id, collection_model);
  }

  static fromJS(collections, tray_view_store) {
    const collection_store = new CollectionStore();

    collections.map((c) => {
      let collection_model = CollectionModel.fromJS(c, tray_view_store);
      collection_store[`${collection_model.write_state}_collections`].set(collection_model.id, collection_model);
    });

    tray_view_store.collection_store = collection_store;
    return collection_store;
  }
}
