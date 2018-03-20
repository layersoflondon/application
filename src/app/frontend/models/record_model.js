import {observable} from 'mobx';

export default class RecordModel {
  store;
  id;
  name;
  position;

  constructor(store, id, name, position) {
    this.store = store;
    this.id = id;
    this.name = name;
    this.position = position;
  }
}
