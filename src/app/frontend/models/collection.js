import {computed, observable} from 'mobx';
import RecordModel from './record';

export default class CollectionModel {
  id;
  title;
  description;
  read_state;
  write_state;
  owner = {};
  is_collection = true;
  @observable records = [];
  @observable image = null;

  @computed get position() {
    return [0, 0];
  }

  static fromJS(attributes, from_record = false) {
    const collection = new CollectionModel();
    collection.id = attributes.id;
    collection.title = attributes.title;
    collection.description = attributes.description;
    collection.read_state = attributes.read_state;
    collection.write_state = attributes.write_state;
    collection.owner = attributes.owner;

    if( !from_record && attributes.hasOwnProperty('records') ) {
      collection.records = attributes.records.map((r) => RecordModel.fromJS(r));
    }

    if( attributes.hasOwnProperty('image') ) {
      collection.image = attributes.image;
    }

    return collection;
  }
}

window.CollectionModel = CollectionModel;