import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Layer extends LoLHTTPBase {
  static resource_path = '/layers'; static path = '/layers';

    static search(params) {
        return axios.get(`${this.resource_path}`, {params: params});
    }

    static resourceIdPath(layer_id){
        this.resource_path = this.path = `/layers/${layer_id}`;
    }
}

window.Layer = Layer;