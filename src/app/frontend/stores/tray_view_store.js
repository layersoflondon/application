import {observable, observe, computed} from 'mobx';

export default class TrayViewStore {
  @observable cardStore = null;
  previousCardStore = null;

  constructor() {
    observe(this, 'cardStore', (change) => {
      this.previousCardStore = change.oldValue;
    });
  }
}
