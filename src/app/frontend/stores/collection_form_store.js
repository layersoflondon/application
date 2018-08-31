import {observable, computed, observe} from 'mobx';

import CollectionModel from '../models/collection';

/**
 * Build a new Collection instance
 */
export default class CollectionFormStore {
  id = null;

  @observable collection = new CollectionModel();

  static fromJS(object) {
    const store = new CollectionFormStore();
    Object.assign(store, object);
    return store;
  }
}
