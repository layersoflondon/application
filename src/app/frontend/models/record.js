import {observable, computed} from 'mobx';
import CollectionModel from './collection';
import Record from "../sources/record";
import MediaItemStore from "../stores/media_item_store";
import Parser from "html-react-parser";
import L from "leaflet";

export default class RecordModel {
  id = null;
  state;
  lat;
  lng;
  user = {};
  created_at;

  @observable title = '';
  @observable description = '';
  @observable location = null;
  @observable latlng = null;

  @observable like_count = 0;
  @observable view_count = 0;

  @observable date_from_object = {date: '', month: '', year: ''};
  @observable date_to_object = {date: '', month: '', year: ''};

  @observable image = null;
  @observable attachments = [];
  @observable current_attachment_item_index = this.attachments.length>0 ? 0 : null; //which media item is active (being edited)
  @observable collections = [];
  @observable collection_ids = [];

  persist() {
    if( this.id ) {
      return Record.update(null, this.id, {record: this.toJS()});
    }else {
      return Record.create(null, {record: this.toJS()});
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
    }else {
      this.date_from_object = {date: '', month: '', year: ''};
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
    }else {
      this.date_to_object = {date: '', month: '', year: ''};
    }
  }

  setCurrentAttachmentItemAsPrimaryImage() {
    console.log("Set something", this.current_attachment_item);
  }

  @computed get current_attachment_item() {
    if( typeof this.current_attachment_item_index === "number" ) {
      return this.attachments[this.current_attachment_item_index];
    }
  }

  @computed get _collection_ids() {
    return this.collections.map((c)=>c.id);
  }
  set _collection_ids(id) {
    //todo: make this work for multiple collections
    // const collection_ids = this.collection_ids.slice();
    // collection_ids.push(id);
    // this.collection_ids = collection_ids;
    this.collection_ids = [parseInt(id, 10)];
  }

  @computed get user_can_edit_record() {
    return this.user_can_edit;
  }

  @computed get user_can_like_record() {
    return this.user_can_like;
  }

  incrementLikeCount() {
    Record.like(this.id).then((response) => {
      this.like_count = response.data.like_count;
    });
  }

  icon() {
    const default_icon = new L.Icon({
      iconUrl: require('../assets/images/record-marker.png'),
      iconRetinaUrl: require('../assets/images/record-marker-x2.png'),

      iconSize: [22, 30],
      shadowSize: [0, 0],
      iconAnchor: [11, 20],
      popupAnchor: [0, -33]
    });

    return default_icon;
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
      collection_ids: this._collection_ids,
      location: this.location
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
    record.image = attributes.image;
    record.created_at = attributes.created_at;

    record.user_can_like = attributes.user_can_like;
    record.user_can_edit = attributes.user_can_edit;

    if( attributes.hasOwnProperty('attachments') ) {
      record.attachments = attributes.attachments.map((attachment) => {
        return MediaItemStore.fromJS(attachment, attributes.id);
      });
    }

    if( attributes.hasOwnProperty('collections') ) {
      record.collections = attributes.collections.map((c) => CollectionModel.fromJS(c, true));
    }

    return record;
  }

  resetState() {
    this.id = null;
    this.title = '';
    this.description = '';
    this.like_count = '';
    this.view_count = '';
    this.state = '';
    this.lat = 0;
    this.lng = 0;
    this.date_from = null;
    this.date_to = null;
    this.location = {};
    this.user  = '';
    this.created_at = '';
    this.attachments = [];
    this.collections = [];

    return this;
  }
}

window.RecordModel = RecordModel;
