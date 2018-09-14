import {observable, computed} from 'mobx';
import CollectionModel from '../models/collection';

/**
 * Stores a list of collections which can be assigned to records by the current user.
 */
export default class CollectionStore {

  @observable everyone_collections = observable.map();
  @observable user_collections = observable.map();

  @computed get collections() {
    let _collections = [];
    this.everyone_collections.values().map((c) => _collections.push(c));
    this.user_collections.values().map((c) => _collections.push(c));

    return _collections;
  }

  addCollection(collection_model) {
    if(collection_model.write_state === 'everyone') {
      this.everyone_collections.set(collection_model.id, collection_model);
    }else {
      this.user_collections.set(collection_model.id, collection_model);
    }
  }

  collectionsCreatedByUser(user) {
    const created_by_user = this.user_collections.entries().filter((c) => c[1].owner.type.search(/^(Alpha::)?User$/)>-1 && c[1].owner.id === user.id );
    return created_by_user.map((c) => c[1]);
  }

  static fromJS(collections, tray_view_store) {
    const collection_store = new CollectionStore();

    collections.map((c) => {
      let collection_model = CollectionModel.fromJS(c, tray_view_store);

      if( collection_model.write_state === 'everyone' && (collection_model.hasOwnProperty('owner') && collection_model.owner.id !== window.__USER.id)) {
        collection_store[`${collection_model.write_state}_collections`].set(collection_model.id, collection_model);
      }else {
        collection_store.user_collections.set(collection_model.id, collection_model);
      }
    });

    tray_view_store.collection_store = collection_store;
    return collection_store;
  }
}
