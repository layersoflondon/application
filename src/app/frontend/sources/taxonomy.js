import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Taxonomy extends LoLHTTPBase {
  static resource_path = '/taxonomies'; static path = '/taxonomies';
}
