import {observable, computed} from 'mobx';

export default class TrayCardData {
  @observable highlighted;

  constructor(card) {
    this.card = card;

    this.id = card.id;
    this.title = card.title;
    this.description = card.description;
    this.period = card.period;
    this.primary_image = card.primary_image;

    this.highlighted = false;
    if( this.is_collection ) {
      this.records = card.records.map((r) => new TrayCardData(r));
    }else {
      this.lat = card.lat;
      this.lng = card.lng;
    }
  }

  @computed get position() {
    return [this.lat, this.lng];
  }

  @computed get is_collection() {
    return this.card.hasOwnProperty('records');
  }

  static fromJS(object) {
    return new TrayCardData(object);
  }
}
