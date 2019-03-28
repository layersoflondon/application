import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class GeoreferencerProject extends LoLHTTPBase {
  static resource_path = '/layermaker'; static path = '/layermaker';

  static show(id) {
    return axios.get(`${id}.json`);
  }
}

window.GeoreferencerProject = GeoreferencerProject;