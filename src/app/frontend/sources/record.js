import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Record extends LoLHTTPBase {
  static resource_path = '/records'; static path = '/records';

  static patch(resource_id, id, params) {
    return axios.patch(`${this.resource_path}`, params);
  }

  static like(id) {
    return axios.patch(`${this.resource_path}/like.json`)
  }

  static report(id, params) {
    return axios.post(`${this.resource_path}/report`, params);
  }

  static add_to_collections(id, params) {
    return axios.patch(`${this.resource_path}/collections`, params)
  }

  static remove_from_collections(id, params) {
    return axios({method: 'delete', url: `${this.resource_path}/collections`, data: params});
  }
}
