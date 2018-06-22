import {observable, computed} from 'mobx';
import RecordModel from "../models/record";
import CollectionModel from "../models/collection";

export default class CardModel {
  @observable highlighted; // the pins associated with this card should be highlighted
  @observable highlighted_by_marker; // the marker associated with this card has been hovered
  @observable image;

  constructor(object, store = null) {
    this.object = object;

    if(store) {
      this.store = store;
    }

    this.highlighted = false;

    if( this.is_collection ) {
      this.data = CollectionModel.fromJS(object, store);
    }else {
      this.data = RecordModel.fromJS(object, store);
    }
  }

  @computed get id() {
    return this.is_collection ? `collection_${this.data.id}` : `record_${this.data.id}`;
  }

  @computed get is_collection() {
    return this.object.hasOwnProperty('records');
  }

  static fromJS(object, store) {
    return new CardModel(object, store);
  }
}

window.CardModel = CardModel;