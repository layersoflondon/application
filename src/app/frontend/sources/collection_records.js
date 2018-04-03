import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class CollectionRecords extends LoLHTTPBase {
  static resource_path = '/collections'; static path = '/collections';

  static resourceIdPath(record_id){
    this.resource_path = this.path = `/collections/${record_id}/records`;
  }
}
