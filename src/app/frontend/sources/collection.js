import LoLHTTPBase from './lol_http_base';
import axios from 'axios';
window.axios = axios;

export default class Collection extends LoLHTTPBase {
  static resource_path = '/collections'; static path = '/collections';

  static writable_by_everyone() {
    return axios.get(`/collections?everyone=true&per_page=1000`); //fixme - we need to use the ES streaming api to get all of the collections
  }

  static owned_by_user(user_id) {
    return axios.get(`/users/${user_id}/collections`); //fixme - we need to use the ES streaming api to get all of the collections
  }

  static setResourcePath(resource_id, id, method){

    if (resource_id) {
      this.resourceIdPath(resource_id);
    }
    if (id) {
      this.resource_path = this.path + `/${id}`;
    }
    //console.log(`${method}: ${this.resource_path}\n\n`);
  }

  static index(resource_id, id) {
    this.setResourcePath(resource_id, id, 'INDEX');
    return axios.get(`${this.resource_path}`);
  }
  //
  // static create(resource_id, params) {
  //   this.setResourcePath(resource_id, null, 'CREATE');
  //   return axios.post(`${this.path}`, params);
  // }

  static show(resource_id, id) {
    this.setResourcePath(resource_id, id, 'SHOW');
    return axios.get(`${this.resource_path}`);
  }
  //
  // static update(resource_id, id, params) {
  //   this.setResourcePath(resource_id, id, 'UPDATE');
  //   return axios.put(`${this.resource_path}`, params);
  // }

  static destroy(resource_id, id) {
    this.setResourcePath(resource_id, id, 'DELETE');
    return axios.delete(`${this.resource_path}`);
  }

  static everyone() {
    return axios.get("/")
  }

  static query(query) {
    let params = {params: {...query, query: true}};
    return axios.get('/collections', params);
  }
}
