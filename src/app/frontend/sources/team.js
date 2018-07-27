import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Team extends LoLHTTPBase {
  static resource_path = '/teams.json'; static path = '/teams.json';
}

window.Team = Team;