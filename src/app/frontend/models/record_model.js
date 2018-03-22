import {observable} from 'mobx';

export default class RecordModel {
  store;
  id;
  name;
  position;

  constructor(store, record) {
    this.store = store;
    this.id = record.id;
    this.name = record.name;
    this.position = record.position;
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }
}
