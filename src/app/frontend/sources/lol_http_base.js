import axios from 'axios';

axios.defaults.headers.delete['auth'] = {username: 'test@error.agency', password: '123456'};

export default class LoLHTTPBase {
  static all() {
    console.log(`INDEX: ${this.resource_path}\n\n`);
    return axios.get(`${this.resource_path}`);
  }

  static find(id) {
    console.log(`SHOW ${this.resource_path}/${id}\n\n`);
    return axios.get(`${this.resource_path}/${id}`);
  }

  static where(params) {
    console.log(`GET ${this.resource_path}\n\n`);
  }

  static destroy(id) {
    console.log(`DESTROY ${this.resource_path}/${id}\n\n`);
    return axios.delete(`${this.resource_path}/${id}`);
  }
}
