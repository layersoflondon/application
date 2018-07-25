import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Collection extends LoLHTTPBase {
  static resource_path = '/collections'; static path = '/collections';

  static writable_by_everyone() {
    return axios.get(`/collections?everyone=true`);
  }
}
