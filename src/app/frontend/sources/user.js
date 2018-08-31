import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class User extends LoLHTTPBase {
  static resource_path = '/users'; static path = '/users';

  static show(resource_id, id) {
    this.setResourcePath(resource_id, id, 'SHOW');
    return axios.get(`${this.resource_path}`);
  }
}

window.User = User;