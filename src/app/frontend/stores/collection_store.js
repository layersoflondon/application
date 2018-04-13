import {observable} from 'mobx';

export default class CollectionStore {
  @observable collections = [];

  /**
   * return an instance of the store populated with the array of Collection objects
   * @param array
   */
  static fromJS(array) {
    // const store = new CollectionStore();
    // store.collections = array.map( (c) => CollectionModel.fromJS(store, c) );
    //
    // return store;
  }
}
