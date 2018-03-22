// import {observable} from 'mobx';

import RecordModel from './record_model';

export default class CardModel {
  store;
  id;
  record;
  highlighted;
  active;

  constructor(store, card) {
    this.store = store;

    this.id = card.id;
    this.name = card.name;
    this.description = card.description;
    this.period = card.period;
    this.image = card.image;

    this.record = new RecordModel(store, card.record);
    
    this.highlighted = false;
    this.active = false;
  }

  toJS() {
    return {id: this.id, name: this.name, description: this.description, period: this.period, image: this.image, record: this.record.toJS() };
  }

  toggleHighlighted() {
    this.highlighted = !this.highlighted;
  }

  toggleActive() {
    this.active = !this.active;

    console.log(`Setting card ${this.id} as active`);
  }

  static fromJS(store, object) {
    return new CardModel(store, object);
  }
}
