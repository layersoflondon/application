import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Search extends LoLHTTPBase {
    static resource_path = '/search'; static path = '/search';

    static perform(params) {
        console.log("Performing search: ", params);
        return axios.post(`${this.resource_path}`, params);
    }
}

window.Search = Search;
