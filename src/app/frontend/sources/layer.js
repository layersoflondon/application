import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Layer extends LoLHTTPBase {
  static resource_path = '/layers'; static path = '/layers';

  static search(params) {
    return axios.get(`${this.resource_path}`, {params: params});
  }

  static show(id) {
    return axios.get(`/layers/${id}.json`);
  }
}

window.Layer = Layer;
