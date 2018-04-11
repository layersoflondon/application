import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Team extends LoLHTTPBase {
  static resource_path = '/teams'; static path = '/teams';
}
