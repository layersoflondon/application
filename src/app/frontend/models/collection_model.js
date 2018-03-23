import {observable, computed} from 'mobx';

import CardModel from './card_model';
import RecordModel from "./record_model";

export default class CollectionModel {
  store;
  id;
  name;
  description;
  parent_card;
  @observable cards;

  constructor(store, collection, card) {
    this.id = collection.id;
    this.name = collection.name;
    this.description = collection.description;
    this.image = collection.image;

    this.parent_card = card;
    this.cards = collection.records.map((r) => new CardModel(store, r, card))
  }
}
