import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Record extends LoLHTTPBase {
  static resource_path = '/records'; static path = '/records';
}
