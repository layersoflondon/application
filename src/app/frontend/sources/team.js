import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Team extends LoLHTTPBase {
  static path = '/teams.json';

  static show(resource_id, id) {
    this.resource_path = `/teams/${id}.json`;
    return axios.get(`${this.resource_path}`);
  }

  static index() {
    return axios.get(`${this.path}`);
  }

}


