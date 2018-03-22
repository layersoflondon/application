import {observable} from 'mobx';

import RecordModel from './record_model';

export default class CardModel {
  store;
  id;
  record;

  collection;

  @observable highlighted;
  visible;

  constructor(store, card) {
    this.store = store;

    this.id = card.id;
    this.name = card.name;
    this.description = card.description;
    this.period = card.period;
    this.image = card.image;

    this.is_collection = card.is_collection;

    this.highlighted = false;
    this.visible = false;

    if( card.records ) {
      this.records = card.records.map((r) => new RecordModel(store, r, this));
    }
  }

  latlng(object=false) {
    const ll = this.is_collection ? this.records[0].position : this.records[0].position;

    if( object ){
      return {lat: ll[0], lng: ll[1]}
    }

    return ll;
  }

  toJS() {
    return {id: this.id, name: this.name, description: this.description, period: this.period, image: this.image, records: this.records.map((r)=>r.toJS()) };
  }

  static fromJS(store, object) {
    return new CardModel(store, object);
  }
}
