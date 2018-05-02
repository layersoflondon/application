import {observable} from 'mobx';

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
export default class RecordStore {
  @observable records = [];

  static fromJS(object) {
    const store = new RecordStore();
    Object.assign(store, object);
    return store;
  }
}
