export default class CollectionModel {
  id;
  title;
  description;
  read_state;
  write_state;
  owner = {};
  records = [];

  constructor(attributes) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.read_state = attributes.read_state;
    this.write_state = attributes.write_state;
    this.owner = attributes.owner;
    this.records = attributes.records;
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
  }
}
