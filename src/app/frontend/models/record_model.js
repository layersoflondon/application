import {observable} from 'mobx';

export default class RecordModel {
  store;
  id;
  name;
  position;

  @observable visible;

  constructor(store, record, card) {
    this.store = store;
    this.card = card;

    this.id = record.id;
    this.name = record.name;
    this.description = record.description;
    this.image = record.image;
    this.position = record.position;

    this.visible = false;
  }

  latlng(object=false) {
    const ll = this.position;

    if( object ){
      return {lat: ll[0], lng: ll[1]}
    }

    return ll;
  }

  toJS() {
    return {
      id: this.id,
      name: this.name,
      position: this.position
    }
  }
}
