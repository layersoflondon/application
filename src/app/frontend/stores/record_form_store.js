import {observable, computed, observe} from 'mobx';
import Record from '../sources/record';
import GoogleMapsClient from '../sources/google_maps_client';

/**
 * Build a new Record instance
 */
export default class RecordFormStore {
  id = null;
  title = '';
  description = '';
  links = [];
  collection_id = null;
  team_id = null;
  collection_type_id = null;

  // null = not looking up,
  // true = active.
  // 200 = lookup finished, success.
  // other http code = lookup failed.
  @observable place_lookup_status = null;
  @observable place = null;
  @observable latlng = null;

  @observable date_from_object = {date: '', month: '', year: ''};
  @observable date_to_object = {date: '', month: '', year: ''};

  @observable attachments = [];
  @observable visible_pane = null; // which accordion pane is visible
  @observable current_attachment_item_index = this.attachments.length>0 ? 0 : null; //which media item is active (being edited)
  @observable primary_image = null;

  constructor() {
    observe(this, 'latlng', (update) => {
      if( update.newValue && update.newValue.lat && update.newValue.lng ) {
        this.startLookup();
      }
    });
  }

  @computed get current_attachment_item() {
    if( typeof this.current_attachment_item_index === "number" ) {
      return this.attachments[this.current_attachment_item_index];
    }
  }

  @computed get lat() {
    return this.latlng.lat;
  }
  @computed get lng() {
    return this.latlng.lng;
  }

  @computed get date_from() {
    const values = new Set( Object.values(this.date_from_object) );
    if( values.size === 1 && values.has("") ) return null;

    let date = new Date();
    date.setDate(this.date_from_object.date);
    date.setMonth(this.date_from_object.month);
    date.setFullYear(this.date_from_object.year);

    return date;
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

    return date;
  }
  set date_to(value) {
    if(value) {
      const date = new Date(value);
      this.date_to_object = {date: date.getDate(), month: date.getMonth()+1, year: date.getFullYear()};
    }
  }

  persist() {
    if( !this.id ) {
      Record.create(null, this.toJS()).then((response) => {
        this.assignFromJS(response.data);
      }).catch((error) => {
        // TODO: render validation errors in a component
        console.log("Validation errors: ", error);
      });
    }else {
      const id = this.toJS().id;
      Record.update(null, id, this.toJS()).then((response) => {
        console.log("Updated object");
      }).catch((error) => {
        console.log("1234");
      });
    }
  }

  startLookup() {
    this.place_lookup_status = true;
    GoogleMapsClient.addressLookUp(this.lat, this.lng).then((response)=> {
      this.place_lookup_status = response.status;

      // console.log(response.status, response.json.results);

      if( response.json.results.length > 0 ) {
        this.place = response.json.results[0].formatted_address;
      }else {
        this.place_lookup_status = 404
      }
    }).catch((error)=>{console.log("Google error:", error)});
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
      links: this.links,
      collection_id: this.collection_id,
      team_id: this.team_id,
      collection_type_id: this.collection_type_id
    }
  }

  assignFromJS(object) {
    this.id = object.id;
    this.title = object.title;
    this.description = object.description;
    this.latlng = {lat: object.lat, lng: object.lng};
    this.date_from = object.date_from;
    this.date_to = object.date_to;
    this.links = object.links;
    this.primary_image = object.primary_image;
  }

  static fromJS(object) {
    this.id = object.id;
    this.title = object.title;
    this.description = object.description;
  }
}
