import axios from 'axios';

var isMochaTest = typeof document === "undefined";

if (isMochaTest) {
    axios.defaults.proxy = { port: 3000 };
    axios.defaults.auth = {username: 'test@error.agency', password: '123456'};
}else{
    axios.defaults.headers.common['X-CSRF-TOKEN'] = document.head.querySelector("[name=csrf-token]").content;
}

export default class LoLHTTPBase {

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

  static create(resource_id, params) {
    this.setResourcePath(resource_id, null, 'CREATE');
    return axios.post(`${this.resource_path}`, params);
  }

  static show(resource_id, id) {
    this.setResourcePath(resource_id, id, 'SHOW');
    return axios.get(`${this.resource_path}`);
  }

  static update(resource_id, id, params) {
    this.setResourcePath(resource_id, id, 'UPDATE');
    return axios.put(`${this.resource_path}`, params);
  }

  static destroy(resource_id, id) {
    this.setResourcePath(resource_id, id, 'DELETE');
    return axios.delete(`${this.resource_path}`);
  }
}
