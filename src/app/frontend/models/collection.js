import {computed, observable, observe} from 'mobx';
import RecordModel from './record';
import Collection from "../sources/collection";

export default class CollectionModel {
  @observable id;
  @observable title;
  @observable description;
  @observable read_state;
  @observable write_state;
  @observable write_state_team_id;
  @observable owner = {};
  @observable is_collection = true;
  @observable records = [];
  @observable image = null;
  @observable user_can_edit = false;
  @observable user_can_remove_from = false;
  @observable user_is_owner = false;



  @computed get position() {
    return [0, 0];
  }

  @computed get is_editable() {

    return (!!this.id && this.user_can_edit) || !this.id
  }

  persist() {
    if( this.id ) {
      return Collection.update(null, this.id, {collection: this.toJS()});
    }else {
      return Collection.create(null, {collection: this.toJS()});
    }
  }

  // If there's no image, we need to assign this image a placeholder. We want it to be deterministic so we can render the same class (and get the same placeholder image) in multiple places. So let's use the charcodes of all the chars in the title, mod 10, to get us a number between 0 and 9
  @computed get placeholder_class() {
    const number = this.title.split('').map((c) => {return c.charCodeAt() }).reduce((a,b) => a + b, 0) % 10;
    if (this.has_hero_image) {
      return "";
    } else {
      return `placeholder-${number}`;
    }
  }

  @computed get has_hero_image() {
    return !!(this.image)
  }

  @computed get is_persisted() {
    return !!this.id
  }

  toJS() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      read_state: this.read_state,
      write_state: this.write_state,
      write_state_team_id: this.write_state_team_id,
      owner: this.owner,
      contributor_ids: this.contributor_ids,
      user_can_edit: this.user_can_edit,
      user_is_owner: this.user_is_owner,
      user_can_remove_from: this.user_can_remove_from
    }
  }


  static fromJS(attributes, store = null, from_record = false, build_records = true) {
    const collection = new CollectionModel();

    collection.store = store;

    collection.id = attributes.id;
    collection.title = attributes.title;
    collection.description = attributes.description;
    collection.read_state = attributes.read_state;
    collection.write_state = attributes.write_state;
    collection.write_state_team_id = attributes.write_state_team_id;
    collection.owner = attributes.owner;
    collection.contributor_ids = attributes.contributor_ids;
    collection.user_can_edit = attributes.user_can_edit;
    collection.user_can_remove_from = attributes.user_can_remove_from;
    collection.user_is_owner = attributes.user_is_owner;

    if( !from_record && attributes.hasOwnProperty('records') && build_records ) {
      // iterate over this collection's records and either fetch the existing record from the store, or build a new one
      collection.records = attributes.records.map((r) => {
        let card = store.cards.get(`record_${r.id}`);
        let record = null;
        if(card) {
          record = card.data;
        }else {
          record = RecordModel.fromJS(r, store);
        }

        return record;
      });
    }

    if( attributes.hasOwnProperty('image') ) {
      collection.image = attributes.image;
    }

    return collection;
  }


}