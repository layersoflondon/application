import {observable, computed} from 'mobx';

export default class CardModel {
  @observable highlighted;

  constructor(record_or_collection) {
    this.object = record_or_collection;

    this.id = record_or_collection.id;
    this.title = record_or_collection.title;
    this.description = record_or_collection.description;
    this.period = record_or_collection.period;
    this.primary_image = record_or_collection.primary_image;

    this.highlighted = false;

    if( this.is_collection ) {
      this.records = record_or_collection.records;
    }else {
      this.lat = record_or_collection.lat;
      this.lng = record_or_collection.lng;
    }
  }

  @computed get position() {
    return [this.lat, this.lng];
  }

  @computed get is_collection() {
    return this.object.hasOwnProperty('records');
  }

  static fromJS(object) {
    return new CardModel(object);
  }
}

window.CardModel = CardModel;