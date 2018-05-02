import {observable, computed, observe} from 'mobx';
import Record from '../sources/record';
import GoogleMapsClient from '../sources/google_maps_client';

import RecordModel from '../models/record';

/**
 * Build a new Record instance
 */
export default class RecordFormStore {
  id = null;
  collections = [];

  @observable found_places = [];

  @observable record = new RecordModel();
  @observable latlng;
  @observable visible_pane = null; // which accordion pane is visible
  @observable current_attachment_item_index = this.record.attachments.length>0 ? 0 : null; //which media item is active (being edited)

  // null = not looking up,
  // true = active.
  // 200 = lookup finished, success.
  // other http code = lookup failed.
  @observable place_lookup_status = null;

  constructor() {
    observe(this, 'latlng', (update) => {
      if( update.newValue && update.newValue.lat && update.newValue.lng ) {
        this.record.lat = update.newValue.lat;
        this.record.lng = update.newValue.lng;

        this.startLookup();
      }
    });
  }

  @computed get current_attachment_item() {
    if( typeof this.current_attachment_item_index === "number" ) {
      return this.record.attachments[this.current_attachment_item_index];
    }
  }

  startLookup() {
    this.place_lookup_status = true;
    GoogleMapsClient.addressLookUp(this.record.lat, this.record.lng).then((response)=> {
      this.place_lookup_status = response.status;

      if( response.json.results.length > 0 ) {
        this.record.location = {address: response.json.results[0].formatted_address};
        this.found_places = response.json.results;
      }else {
        this.place_lookup_status = 404
      }
    }).catch((error)=>{console.log("Google error:", error)});
  }

  static fromJS(object) {
    const store = new RecordFormStore();
    Object.assign(store, object);
    return store;
  }
}
