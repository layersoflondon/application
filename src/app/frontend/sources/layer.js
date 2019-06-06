import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class LayerGroup extends LoLHTTPBase {
  static resource_path = '/layers'; static path = '/layers';

    static search(query) {
        const params = {params: {...query}};
        return axios.get(`${this.resource_path}`, params);
    }

    static resourceIdPath(layer_id){
        this.resource_path = this.path = `/layers/${layer_id}`;
    }
}

window.LayerGroup = LayerGroup;