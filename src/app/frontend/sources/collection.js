import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Collection extends LoLHTTPBase {
  static resource_path = '/collections'; static path = '/collections';

  static writable_by_everyone() {
    return axios.get(`/collections?everyone=true&per_page=500`); //fixme - we need to use the ES streaming api to get all of the collections
  }
}
