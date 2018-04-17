import {observable, computed, observe} from 'mobx';
import RecordAttachments from '../sources/record_attachments';

export default class MediaItemStore {
  id = null;
  @observable record_id = null;

  @observable file = null;
  @observable type = null;
  @observable title = null;
  @observable description = null;
  @observable credit = null;

  constructor(record_id, object) {
    this.id = object.id;
    this.record_id = record_id;

    console.log("Building new media item store...");
    console.log(object);

    this.object = object.object;
    this.file = object.file;
    this.type = object.type;
    this.title = object.title;
    this.description = object.description;
    this.credit = object.credit;
  }

  persist() {
    const data = new FormData();
    data.append('attachable_attributes[title]', this.title);
    data.append('attachable_attributes[description]', this.description);
    data.append('attachable_attributes[credit]', this.credit);
    data.append('attachment_type', this.type);
    // data.append('file', this.file);
    return RecordAttachments.create(this.record_id, data);
  }
}
