import {computed, observable} from 'mobx';

export default class CollectionModel {
  id;
  title;
  description;
  read_state;
  write_state;
  owner = {};
  @observable records = [];

  @computed get position() {
    return [0, 0];
  }

  static fromRecord(attributes) {
    const collection = new CollectionModel();
    collection.id = attributes.id;
    collection.title = attributes.title;
    collection.description = attributes.description;
    collection.read_state = attributes.read_state;
    collection.write_state = attributes.write_state;
    collection.owner = attributes.owner;
    collection.records = attributes.records;

    return collection;
  }

  static fromJS(attributes) {
    const collection = new CollectionModel();
    collection.id = attributes.id;
    collection.title = attributes.title;
    collection.description = attributes.description;
    collection.read_state = attributes.read_state;
    collection.write_state = attributes.write_state;
    collection.owner = attributes.owner;
    collection.records = attributes.records;

    return collection;
  }
}
