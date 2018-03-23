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

    if( this.is_collection ) {
      this.records = card.records;
    }else {
      this.position = card.position;
    }
  }

  //todo: make this a computed property
  latlng(object=false) {
    const ll = this.is_collection ? this.records[0].position : this.position;

    if( object ){
      return {lat: ll[0], lng: ll[1]}
    }

    return ll;
  }

  toJS() {
    let _card = {id: this.id, name: this.name, description: this.description, period: this.period, image: this.image};
    if(this.is_collection) {
      _card.records = this.records;
    }else {
      _card.position = this.position;
    }

    return _card;
  }

  static fromJS(store, object) {
    return new CardModel(store, object);
  }
}
