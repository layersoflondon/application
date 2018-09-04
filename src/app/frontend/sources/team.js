import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Team extends LoLHTTPBase {
  static path = '/teams.json';

  static resourceIdPath(record_id){
    this.resource_path = this.path = `/collections/${record_id}/records`;
  }

  static show(resource_id, id) {
    this.resource_path = `/teams/${id}.json`;
    return axios.get(`${this.resource_path}`);
  }

}


