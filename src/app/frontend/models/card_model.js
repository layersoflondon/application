import {observable} from 'mobx';

import RecordModel from './record_model';

export default class CardModel {
  store;
  id;
  record;

  collection;

  @observable highlighted;
  @observable active;

  constructor(store, card) {
    this.store = store;

    this.id = card.id;
    this.name = card.name;
    this.description = card.description;
    this.period = card.period;
    this.image = card.image;

    this.record = new RecordModel(store, card.record);

    this.collection = false;
    
    this.highlighted = false;
    this.active = false;
  }

  latlng(object=false) {
    const ll = this.collection ? this.collection.latlng : this.record.position;

    if( object ){
      return {lat: ll[0], lng: ll[1]}
    }

    return ll;
  }

  toJS() {
    return {id: this.id, name: this.name, description: this.description, period: this.period, image: this.image, record: this.record.toJS() };
  }

  toggleHighlighted() {
    this.highlighted = !this.highlighted;

    console.log(`Setting card ${this.id} as highlighted`);
  }

  toggleActive() {
    this.active = !this.active;

    console.log(`Setting card ${this.id} as active`);
  }

  static fromJS(store, object) {
    return new CardModel(store, object);
  }
}
