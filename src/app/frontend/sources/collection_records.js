import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class CollectionRecords extends LoLHTTPBase {
  static resource_path = '/collections';

  static all(collection_id){
      this.resource_path = `/collections/${collection_id}/records`;
      return super.all();
  }

  static post(collection_id, params) {
      this.resource_path = `/collections/${collection_id}/records`;
      console.log(`CREATE: ${this.resource_path}\n\n`);
      return axios.post(`${this.resource_path}`, params);
  }
  static destroy(collection_id, id){
      this.resource_path = `/collections/${collection_id}/records`;
      return super.destroy(id);
  }
}
