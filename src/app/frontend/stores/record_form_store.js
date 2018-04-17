import {observable, computed, observe} from 'mobx';
import Record from '../sources/record';

/**
 * Build a new Record instance
 */
export default class RecordFormStore {
  id = null;
  title = '';
  description = '';
  date_from = '';
  date_to = '';
  latlng = null;
  links = [];
  collection_id = null;
  team_id = null;
  collection_type_id = null;

  @observable attachments = [];
  @observable visible_pane = null; // which accordion pane is visible
  @observable current_attachment_item_index = this.attachments.length>0 ? 0 : null; //which media item is active (being edited)
  @observable primary_image = null;

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

  constructor() {
    observe(this, 'attachments', (change) => {
      const new_files = change.newValue.filter((file) => {
        return !file.id;
      });

      const record_attachments_attributes = {attachments_attributes: []};
      new_files.map((file) => {
        let data = new FormData();
        data.append('attachable_attributes[title]', file.title);
        data.append('attachable_attributes[caption]', file.caption);
        data.append('attachable_attributes[credit]', file.credit);
        data.append('attachable_attributes[description]', file.description);
        data.append('attachment_type', 'image');
        data.append('file', file.data);

        record_attachments_attributes.attachments_attributes.push(data);
      });

      console.log("Changed...", new_files);
    });
  }

  persist() {
    if( !this.id ) {
      Record.create(null, this.toJS()).then((response) => {
        this.assignFromJS(response.data);
      }).catch((error) => {
        // TODO: render validation errors in a component
        console.log("Validation errors: ", error.response.data);
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

  storeAttachment() {
    attachments_data = [];
    // Record.update(this.id, attachments_data);
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
