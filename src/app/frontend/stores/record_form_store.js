import {observable, computed, observe, action, runInAction} from 'mobx';
import GoogleMapsClient from '../sources/google_maps_client';
window.GoogleMapsClient = GoogleMapsClient;

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
  @observable visible_tag_group = null;
  clickEventListener = null;

  @observable record_is_loading = false;

  constructor() {
    observe(this, 'latlng', (update) => {
      if( update.newValue && update.newValue.lat && update.newValue.lng ) {
        this.record.lat = update.newValue.lat;
        this.record.lng = update.newValue.lng;

        this.startLookup();
      }
    });

    observe(this, 'visible_tag_group', (change) => {
      if(change.newValue) {
        const tagsContainer = document.querySelector(`.section--add-tags [data-tag-group-id='${change.newValue}']`);

        this.clickEventListener = (event) => {
          const clickedContainer = event.target.classList.toString() === tagsContainer.classList.toString();
          const clickedChildElement = tagsContainer.contains(event.target);

          if(!clickedContainer && !clickedChildElement || event.target.contains(tagsContainer)) {
            runInAction(() => {
              this.visible_tag_group = null;
              this.persistRecord();
            });
          }
        };
        
        document.addEventListener('click', this.clickEventListener);
      }else if(this.clickEventListener) {
        document.removeEventListener('click', this.clickEventListener);
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
    }).catch((error)=>{
      console.log("Google error:", error);
      this.record.location = {address: ''};
      this.found_places = [];
    });
  }

  static fromJS(object) {
    const store = new RecordFormStore();
    Object.assign(store, object);
    return store;
  }

  @action toggleTag(tag_id) {
    tag_id = parseInt(tag_id, 10);
    let tag_ids = (this.record.tag_ids || []).slice();
    let added = true;

    if( this.tagIsChecked(tag_id) ) {
      tag_ids = tag_ids.filter((id) => id !== tag_id);
      added = false;
    }else {
      tag_ids.push(tag_id);
    }

    this.record.tag_ids = tag_ids;

    return added;
  }

  @action clearTags() {
    this.record.tag_ids = [];
  }

  @action checkTags(ids) {
    ids.map((id) => {
      this.toggleTag(id);
    });
  }

  tagIsChecked(id) {
    return (this.record.tag_ids || []).indexOf(id)>-1;
  }

  @action setVisibleTagGroup(id) {
    this.visible_tag_group = parseInt(id, 10);
  }
  
  @action persistRecord() {

    this.record.persist().then((response) => {
      this.record = RecordModel.fromJS(response.data);
      this.record.errors = {};
    }).catch((error) => {
      this.record.errors = error.response.data;
      this.record.errors_on_publishing = error.response.data;
      this.record.valid_for_publishing = false;
    })
  }
}
