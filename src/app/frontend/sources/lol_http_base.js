import axios from 'axios';

// axios.defaults.headers.delete['auth'] = {username: 'test@error.agency', password: '123456'};
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
console.log(getCookie('_layers_app_session'));

// console.log(document.head.querySelector("[name=csrf-param]").content);
// console.log(document.head.querySelector("[name=csrf-token]").content);
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.head.querySelector("[name=csrf-token]").content;
axios.post('/collections',
    {
        "collection" : {
            "title" : "test",
            "description" : "test description",
            "read_state" : "public_read",
            "write_state" : "everyone"
        }
    }
);



export default class LoLHTTPBase {

  static setResourcePath(resource_id, id, method){

      if (resource_id) {
          this.resourceIdPath(resource_id);
      }
      if (id) {
          this.resource_path = this.path + `/${id}`;
      }
      console.log(`${method}: ${this.resource_path}\n\n`);
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
