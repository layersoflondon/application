import {observable, computed, observe} from 'mobx';
import RecordAttachments from '../sources/record_attachments';

export default class MediaItemStore {
  id = null;
  @observable record_id = null;

  @observable file = null;
  @observable attachment_type = null;
  @observable title = null;
  @observable description = null;
  @observable credit = null;
  @observable is_primary = false;

  constructor(record_id, object) {
    this.record_id = record_id;

    this.id = object.id;
    this.object = object.object;
    this.file = object.file;
    this.url = object.url;
    this.attachment_type = object.attachment_type;
    this.title = object.title;
    this.description = object.description;
    this.credit = object.credit;
    this.is_primary = object.is_primary;
  }

  persist() {
    const data = new FormData();
    data.append('attachable_attributes[title]', this.title);
    data.append('attachable_attributes[description]', this.description);
    data.append('attachable_attributes[credit]', this.credit);

    if( this.id ) {
      return RecordAttachments.update(this.record_id, this.id, data);
    }else {
      data.append('attachment_type', this.attachment_type);
      data.append('attachable_attributes[file]', this.file);
      return RecordAttachments.create(this.record_id, data);
    }
  }
}
