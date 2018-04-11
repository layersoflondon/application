import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Collection extends LoLHTTPBase {
  static resource_path = '/collections'; static path = '/collections';
}
