import {observable, observe, computed} from 'mobx';

export default class TrayViewStore {
  // the TrayViewStore is given its datasource (the cardStore attribute) and it renders it as a list in the tray
  @observable cardStore = null;
  previousCardStore = null;

  constructor() {
    observe(this, 'cardStore', (change) => {
      this.previousCardStore = change.oldValue;
    });
  }
}
