import {observable, computed} from 'mobx';
import CollectionModel from './collection';
import Record from "../sources/record";
import MediaItemStore from "../stores/media_item_store";

export default class RecordModel {
  id = null;
  title = '';
  description = '';
  like_count = 0;
  view_count = 0;
  state;
  lat;
  lng;
  user = {};
  created_at;

  @observable location = null;
  @observable latlng = null;

  @observable date_from_object = {date: '', month: '', year: ''};
  @observable date_to_object = {date: '', month: '', year: ''};

  @observable attachments = [];
  @observable current_attachment_item_index = this.attachments.length>0 ? 0 : null; //which media item is active (being edited)
  @observable primary_image = null;
  @observable collections = [];
  @observable collection_ids = [];

  persist() {
    // if( !this.id ) {
    //   Record.create(null, {record: this.toJS()}).then((response) => {
    //     Object.assign(this, response.data);
    //   }).catch((error) => {
    //     // TODO: render validation errors in a component
    //     console.log("Validation errors: ", error);
    //   });
    // }else {
    //   const id = this.toJS().id;
    //   Record.update(null, id, {record: this.toJS()}).then((response) => {
    //     Object.assign(this, response.data);
    //   }).catch((error) => {
    //     console.log("Error", error);
    //   });
    // }

    if( !this.id ) {
      return Record.create(null, {record: this.toJS()});
    }else {
      return Record.update(null, this.id, {record: this.toJS()});
    }
  }

  @computed get position() {
    return [this.lat, this.lng];
  }

  @computed get date_from() {
    const values = new Set( Object.values(this.date_from_object) );
    if( values.size === 1 && values.has("") ) return null;

    let date = new Date();
    date.setDate(this.date_from_object.date);
    date.setMonth(this.date_from_object.month);
    date.setFullYear(this.date_from_object.year);

    return date.toDateString();
  }
  set date_from(value) {
    if(value) {
      const date = new Date(value);
      this.date_from_object = {date: date.getDate(), month: date.getMonth()+1, year: date.getFullYear()};
    }
  }
  get date_to() {
    const values = new Set( Object.values(this.date_to_object) );
    if( values.size === 1 && values.has("") ) return null;

    let date = new Date();
    date.setDate(this.date_to_object.date);
    date.setMonth(this.date_to_object.month);
    date.setFullYear(this.date_to_object.year);

    return date.toDateString();
  }
  set date_to(value) {
    if(value) {
      const date = new Date(value);
      this.date_to_object = {date: date.getDate(), month: date.getMonth()+1, year: date.getFullYear()};
    }
  }

  @computed get current_attachment_item() {
    if( typeof this.current_attachment_item_index === "number" ) {
      return this.attachments[this.current_attachment_item_index];
    }
  }

  @computed get _collection_ids() {
    return this.collection_ids.toJS();
  }
  set _collection_ids(id) {
    //todo: make this work for multiple collections
    // const collection_ids = this.collection_ids.slice();
    // collection_ids.push(id);
    // this.collection_ids = collection_ids;
    this.collection_ids = [parseInt(id, 10)];
  }

  toJS() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      lat: this.lat,
      lng: this.lng,
      date_from: this.date_from,
      date_to: this.date_to,
      collection_ids: this.collection_ids.toJS()
    }
  }

  static fromJS(attributes) {
    let record = new RecordModel();

    record.id = attributes.id;
    record.title = attributes.title;
    record.description = attributes.description;
    record.like_count = attributes.like_count;
    record.view_count = attributes.view_count;
    record.state = attributes.state;
    record.lat = attributes.lat;
    record.lng = attributes.lng;
    record.date_from = attributes.date_from;
    record.date_to = attributes.date_to;
    record.user  = attributes.user;

    record.attachments = attributes.attachments.map((attachment) => {
      return MediaItemStore.fromJS(attachment, attributes.id);
    });

    record.collections  = attributes.collections.map((c) => CollectionModel.fromRecord(c));
    record.created_at = attributes.created_at;

    return record;
  }
}