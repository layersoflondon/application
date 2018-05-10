import LoLHTTPBase from './lol_http_base';

export default class TeamUsers extends LoLHTTPBase {
  static resource_path = '/teams'; static path = '/teams';

  static resourceIdPath(record_id){
    this.resource_path = this.path = `/teams/${record_id}/users`;
  }
}
