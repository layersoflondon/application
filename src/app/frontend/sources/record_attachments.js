import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class RecordAttachments extends LoLHTTPBase {
  static resource_path = '/records'; static path = '/records';

  static resourceIdPath(record_id){
      this.resource_path = this.path = `/records/${record_id}/attachments`;
  }
}
