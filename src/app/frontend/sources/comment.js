import LoLHTTPBase from './lol_http_base';
import axios from 'axios';

export default class Comment extends LoLHTTPBase {
  static index(record_id) {
    return axios.get(`/records/${record_id}/comments`);
  }

  static create(record_id, params) {
    return axios.post(`/records/${record_id}/comments`, params);
  }

  static destroy(record_id, id) {
    return axios.delete(`/records/${record_id}/comments/${id}`);
  }

  static flag(record_id, params) {
    return axios.post(`/records/${record_id}/comments`, params);
  }
}

window.Comment = Comment;
