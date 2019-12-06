import {observable, computed, observe} from 'mobx';
import CollectionModel from './collection';
import Record from "../sources/record";
import Attachment from './attachment';
import L from "leaflet";
import moment from 'moment';

export default class RecordModel {
  id = null;
  lat = 0;
  lng = 0;
  user = {};
  created_at;

  @observable title = '';
  @observable description = '';
  @observable credit = '';
  @observable location = null;
  @observable latlng = null;
  @observable state = null;

  @observable like_count = 0;
  @observable view_count = 0;

  @observable date_from_object = {date: "", month: "", year: ""};
  @observable date_to_object = {date: "", month: "", year: ""};

  @observable image = null;
  @observable attachments = [];
  @observable current_attachment_item_index = this.attachments.length>0 ? 0 : null; //which media item is active (being edited)
  @observable collections = [];
  @observable collection_ids = null;

  @observable highlighted = false;
  @observable errors = {};
  @observable errors_on_publishing = {};
  @observable valid_for_publishing = false;
  @observable user_can_publish = true;
  @observable team_id = null;
  @observable allow_team_editing = false;

  @observable view_type = null;
  @observable autogenerated_date_from_fields = [];
  @observable autogenerated_date_to_fields = [];

  @observable comments = [];
  @observable tag_ids = [];

  tag_groups = [];
  related = [];

  added_by_student = false;
  user_can_edit = true;
  user_can_like = true;

  constructor() {
    // observe the record's collection IDs
    // if (!!this.id) {
      this.observerDisposer = observe(this, 'collection_ids', (change) => {
        // we only want to fire this if the previous value wasn't null, because that's what it would be when first instantiating the record from JS.
        if (change.oldValue !== null && change.newValue !== null) {
          //  We need to persist the collections at this point - hit the RecordCollections endpoint
          const added_ids = change.newValue.filter((id) => {return change.oldValue.indexOf(id) < 0});
          const removed_ids = change.oldValue.filter((id) => {return change.newValue.indexOf(id) < 0});
          if (added_ids.length) {
            Record.add_to_collections(this.id, {collection_ids: added_ids}).then((result) => {
              this.collection_ids = null;
              this.collection_ids = result.data.collection_ids;
              this.collections = result.data.collections;
            }).catch((errors) => {
              console.log(errors);
            });
          }

          if (removed_ids.length) {
            console.log('removing', removed_ids);
            Record.remove_from_collections(this.id, {collection_ids: removed_ids}).then((result) => {
              this.collection_ids = null;
              this.collection_ids = result.data.collection_ids;
              this.collections = result.data.collections;
            }).catch((errors) => {
              console.log(errors);
            });
          }
        }
      });
    // }


  }

  persist() {
    if( this.id ) {
      return Record.update(null, this.id, {record: this.toJS()});
    }else {
      return Record.create(null, {record: this.toJS()});
    }
  }

  @computed get user_collections() {
    return this.collections.filter((collection) => {
      return collection.user_is_owner;
    }).map((collection) => {
      return collection
    })
  }

  @computed get everyone_collections()  {
    return this.collections.filter((collection) => {
      return !collection.user_is_owner;
    }).map((collection) => {
      return collection
    })
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

  @computed get position() {
    return [this.lat, this.lng];
  }

  @computed get date_from() {
    const values = new Set( Object.values(this.date_from_object) );
    if( values.size === 1 && values.has("") ) return null;

    let date = new Date();
    date.setDate(this.date_from_object.date);
    date.setMonth(this.date_from_object.month-1);
    date.setFullYear(this.date_from_object.year);

    return date.toDateString();
  }
  set date_from(value) {
    if(value) {
      const date = new Date(value);
      this.date_from_object = {date: date.getUTCDate(), month: date.getUTCMonth()+1, year: date.getUTCFullYear()};
    }else {
      this.date_from_object = {date: '', month: '', year: ''};
    }
  }

  @computed get date_to() {
    const values = new Set( Object.values(this.date_to_object) );
    if( values.size === 1 && values.has("") ) return null;

    let date = new Date();
    date.setDate(this.date_to_object.date);
    date.setMonth(this.date_to_object.month-1);
    date.setFullYear(this.date_to_object.year);

    return date.toDateString();
  }
  set date_to(value) {
    if(value) {
      const date = new Date(value);
      this.date_to_object = {date: date.getUTCDate(), month: date.getUTCMonth()+1, year: date.getUTCFullYear()};
    }else {
      this.date_to_object = {date: '', month: '', year: ''};
    }
  }

  @computed get current_attachment_item() {
    if( typeof this.current_attachment_item_index === "number" ) {
      return this.attachments[this.current_attachment_item_index];
    }
  }

  // @computed get _collection_ids() {
  //   return this.collections.map((c)=>c.id);
  // }
  // set _collection_ids(id) {
  //   //todo: make this work for multiple collections
  //   // const collection_ids = this.collection_ids.slice();
  //   // collection_ids.push(id);
  //   // this.collection_ids = collection_ids;
  //   this.collection_ids = [parseInt(id, 10)];
  // }

  @computed get user_can_edit_record() {
    return this.user_can_edit;
  }

  @computed get user_can_like_record() {
    return this.user_can_like;
  }

  @computed get saveButtonLabel() {
    let label = "Publish";

    if( this.id && this.state === 'published' ) {
      label = "Save";
    }

    return label;
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

  // todo: wire this up to the record attachments
  @computed get has_hero_image() {
    return !!(this.image || this.hero_image);
  }

  // todo: wire this up to the hero_image_id attribute
  @computed get hero_image() {
    let hero = this.image;

    if( !hero ) {
      hero = this.media.first;
    }

    return hero;
  }

  @computed get hero_image_media_item() {
    const image = this.hero_image;

    return this.media.find((item) => item.attachable.large === image.large);
  }

  @computed get has_media() {
    const media = this.media;

    return media.length > 0;
  }

  @computed get media() { // excludes youtube videos
    return this.attachments.filter((a) => a.is_media);
  }

  @computed get videos() {
    return this.attachments.filter((a) => a.is_video);
  }

  @computed get media_and_videos() {
    return this.attachments.filter((a) => a.is_video || a.is_media);
  }

  @computed get links() {
    const links = this.attachments.filter((a) => a.is_link);
    return this.attachments.filter((a) => a.is_link);
  }

  @computed get documents() {
    return this.attachments.filter((a) => a.is_document);
  }

  @computed get text() {
    return this.attachments.filter((a) => a.is_text);
  }

  @computed get documents_and_images() {
    return this.attachments.filter((a) => a.is_document_or_image);
  }

  @computed get documents_images_and_video() {
    return this.attachments.filter((a) => (a.is_document_or_image || a.is_media || a.is_video));
  }

  @computed get videos() {
    return this.attachments.filter((a) => (a.is_video));
  }

  get_attachment(id) {
    return this.attachments.find((a) => parseInt(a.id, 10) === parseInt(id, 10));
  }


  @computed get autogenerated_date_from_parts() {
    // take an array of parts and make an object with true / false
    let parts = {};
    ['date', 'month', 'year'].forEach((part) => {
      parts[part] = (!!this.autogenerated_date_from_fields.find((p) => {return p === part}))
    });

    return parts;
  }

  @computed get autogenerated_date_to_parts() {
    // take an array of parts and make an object with true / false
    let parts = {};
    ['date', 'month', 'year'].forEach((part) => {
      parts[part] = (!!this.autogenerated_date_to_fields.find((p) => {return p === part}))
    });
    // the outcome is eg. {date: false, month: true, year: true}
    return parts;
  }
  
  @computed get date_from_formatting_string() {
    const yearFormat = "YYYY";
    const monthFormat = "MMMM";
    const dayFormat = "dddd Do";
    
    let format = [];

    if (!this.autogenerated_date_from_parts.date) {
      format.push(dayFormat);
    }

    if (!this.autogenerated_date_from_parts.month) {
      format.push(monthFormat);
    }

    if (!this.autogenerated_date_from_parts.year) {
      format.push(yearFormat);
    }
    
    return format.join(" ");
    
  }
  
  @computed get date_to_formatting_string() {
    const yearFormat = "YYYY";
    const monthFormat = "MMMM";
    const dayFormat = "dddd do";

    let format = [];

    if (!this.autogenerated_date_to_parts.date) {
      format.push(dayFormat);
    }

    if (!this.autogenerated_date_to_parts.month) {
      format.push(monthFormat);
    }

    if (!this.autogenerated_date_to_parts.year) {
      format.push(yearFormat);
    }

    return format.join(" ");
  }
  
  @computed get display_date_from() {
    const date_from = this.date_from_object;
    const dateString = `${date_from.year.toString().padStart(4,'0')}-${date_from.month.toString().padStart(2,'0')}-${date_from.date.toString().padStart(2,'0')}`;
    const dateFormat = "YYYY-MM-DD";
    return moment(dateString, dateFormat).format(this.date_from_formatting_string);
  }

  @computed get display_date_to() {
    const date_to = this.date_to_object;
    const dateString = `${date_to.year.toString().padStart(4,'0')}-${date_to.month.toString().padStart(2,'0')}-${date_to.date.toString().padStart(2,'0')}`;
    const dateFormat = "YYYY-MM-DD";
    const date = moment(dateString, dateFormat);

    if(date.isValid()) {
      return date.format(this.date_to_formatting_string);
    }
    
    return null;
  }

  toJS() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      lat: this.lat,
      lng: this.lng,
      "date_from(1i)": (this.autogenerated_date_from_parts.year ? "" : String(this.date_from_object.year)),
      "date_from(2i)": (this.autogenerated_date_from_parts.month ? "" : String(this.date_from_object.month)),
      "date_from(3i)": (this.autogenerated_date_from_parts.date ? "" : String(this.date_from_object.date)),
      "date_to(1i)": this.autogenerated_date_to_parts.year ? "" : String(this.date_to_object.year),
      "date_to(2i)": this.autogenerated_date_to_parts.month ? "" : String(this.date_to_object.month),
      "date_to(3i)": this.autogenerated_date_to_parts.date ? "" : String(this.date_to_object.date),
      collection_ids: this.collection_ids,
      user_collections: this.user_collections,
      everyone_collections: this.everyone_collections,
      location: this.location,
      credit: this.credit,
      view_type: this.view_type,
      attachments: this.attachments,
      user: this.user,
      added_by_student: this.added_by_student,
      user_can_edit: this.user_can_edit,
      state: this.state,
      valid_for_publishing: this.valid_for_publishing,
      errors_on_publishing: this.errors_on_publishing,
      user_can_publish: this.user_can_publish,
      has_autogenerated_title: this.has_autogenerated_title,
      team_id: this.team_id,
      allow_team_editing: this.allow_team_editing,
      tag_ids: this.tag_ids
    }
  }

  static fromJS(attributes, store) {
    let record = new RecordModel();

    record.store = store;

    Object.keys(attributes).map((property) => {
      record[property] = attributes[property];
    });

    if( attributes.hasOwnProperty('attachments') ) {
      record.attachments = attributes.attachments.map((attachment) => {
        return Attachment.fromJS(attachment, attributes.id);
      });
    }

    if( attributes.hasOwnProperty('collections') ) {
      record.collections = attributes.collections.map((c) => CollectionModel.fromJS(c, store, true));
    }
    
    return record;
  }

  resetState() {
    Object.getOwnPropertyNames(this).map((property) => {
      let value = this[property];
      switch(value.constructor) {
        case Array:
          this[property] = [];
          break;
        case Object:
          this[property] = {};
          break;
        case Number:
          this[property] = 0;
          break;
        case String:
          this[property] = "";
          break;
        default:
          this[property] = null;
          break;
      }
    });

    this.id = null;
    return this;
  }
}

window.RecordModel = RecordModel;
