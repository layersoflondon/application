import {observable, computed} from 'mobx';

export default class TrayCardData {
  @observable highlighted;

  constructor(store, card) {
    this.store = store;

    this.id = card.id;
    this.title = card.title;
    this.description = card.description;
    this.period = card.period;
    this.primary_image = card.primary_image;

    this.is_collection = card.is_collection;

    this.highlighted = false;
    if( this.is_collection ) {
      this.records = card.records.map((r) => new TrayCardData(store, r));
    }else {
      // this.lat = card.lat
      this.lat = card.lat;
      this.lng = card.lng;
    }
  }

  @computed get position() {
    return [this.lat, this.lng];
  }

  toJS() {
    // let _card = {id: this.id, title: this.title, description: this.description, period: this.period, primary_image: this.primary_image};
    // if(this.is_collection) {
    //   _card.records = this.records;
    // }else {
    //   _card.position = this.position;
    // }
    //
    // return _card;
  }

  static fromJS(store, object) {
    return new TrayCardData(store, object);
  }
}
