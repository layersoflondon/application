import {observable, computed} from 'mobx';
import RecordAttachments from '../sources/record_attachments';

export default class Attachment {
  id = null;
  attachable_type = null;
  attachable = {};

  @observable record_id = null;
  @observable file = null;
  @observable title = '';
  @observable caption = '';
  @observable credit = '';
  @observable url = '';
  @observable is_primary = false;

  persist() {
    const data = new FormData();
    data.append('attachable_attributes[title]', this.title);
    data.append('attachable_attributes[caption]', this.caption);
    data.append('attachable_attributes[credit]', this.credit);

    if( this.media_type === 'image' ) {
      data.append('attachable_attributes[primary]', this.is_primary);
    }else if( this.media_type === 'video' ) {
      data.append('attachable_attributes[youtube_id]', this.url);
    }

    if( !this.id && this.media_type !== 'video' ) {
      data.append('attachable_attributes[file]', this.file);
    }

    if( this.id ) {
      return RecordAttachments.update(this.record_id, this.id, data);
    }else {
      data.append('attachment_type', this.media_type);
      return RecordAttachments.create(this.record_id, data);
    }
  }

  @computed get is_media() {
    return this.attachable_type === 'Attachments::Image' || this.attachable_type === 'Attachments::VideoFile' || this.attachable_type === 'Attachments::AudioFile';
  }

  @computed get is_link() {
    return this.attachable_type === 'Attachments::Url';
  }

  @computed get is_document() {
    return this.attachable_type === 'Attachments::Document' || this.attachable_type === 'Attachments::Dataset';
  }

  @computed get is_text() {
    return this.attachable_type === 'Attachments::Text';
  }

  @computed get is_video() {
    return this.attachable_type === 'Attachments::Video';
  }

  @computed get is_document_or_image() {
    return this.attachable_type === 'Attachments::Image' || this.attachable_type === 'Attachments::Document' || this.attachable_type === 'Attachments::Dataset';
  }

  @computed get media_type() {
    let type = null;
    switch(this.attachable_type) {
      case 'Attachments::Image':
        type = 'image';
        break;
      case 'Attachments::VideoFile':
        type = 'video_file';
        break;
      case 'Attachments::Video':
        type = 'video';
        break;
      case 'Attachments::AudioFile':
        type = 'audio';
        break;
      default:
        try {
          type = this.attachable_type.split("::")[1].toLowerCase();
        }catch(error) {
          type = this.attachable_type;
        }
        break;
    }

    return type;
  }

  static fromJS(object, record_id) {
    const store = new Attachment();

    Object.assign(store, object);
    store.record_id = record_id;

    if(store.is_video) {
      store.url = `https://www.youtube.com/watch?v=${object.attachable.youtube_id}`;
    }

    return store;
  }
}
