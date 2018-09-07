import {observable, computed} from 'mobx';
import RecordAttachments from '../sources/record_attachments';

export default class MediaItemStore {
  id = null;
  attachable_type = null;

  @observable record_id = null;
  @observable file = null;
  @observable title = '';
  @observable caption = '';
  @observable credit = '';
  @observable is_primary = false;

  persist() {
    alert("persist()ing");

    const data = new FormData();
    data.append('attachable_attributes[title]', this.title);
    data.append('attachable_attributes[caption]', this.caption);
    data.append('attachable_attributes[credit]', this.credit);

    if( this.attachment_type === 'image' ) {
      data.append('attachable_attributes[primary]', this.is_primary);
    }

    if( this.id ) {
      return RecordAttachments.update(this.record_id, this.id, data);
    }else {
      data.append('attachment_type', this.attachment_type);
      data.append('attachable_attributes[file]', this.file);
      return RecordAttachments.create(this.record_id, data);
    }
  }

  @computed get is_media() {
    return this.attachable_type === 'Attachments::Image' || this.attachable_type === 'Attachments::Video';
  }

  static fromJS(object, record_id) {
    const store = new MediaItemStore();

    Object.assign(store, object);
    store.record_id = record_id;

    return store;
  }
}
