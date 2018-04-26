import LoLHTTPBase from './lol_http_base';

export default class UserTeams extends LoLHTTPBase {
  static resource_path = '/teams'; static path = '/teams';

  static resourceIdPath(record_id){
    this.resource_path = this.path = `/user/${record_id}/teams`;
  }
}
