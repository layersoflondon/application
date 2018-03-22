import {observable} from 'mobx';

export default class RecordModel {
  store;
  id;
  name;
  position;

  @observable visible;

  constructor(store, record, card) {
    this.store = store;
    this.id = record.id;
    this.name = record.name;
    this.position = record.position;

    this.visible = false;
  }

  toggleVisibility() {
    console.log(`Setting record as visible ${!this.visible}`);
    this.visible = !this.visible
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }
}
