import axios from 'axios';

export default class LoLHTTPBase {
  static all() {
    console.log(`Requesting: ${this.resource_path}.json\n\n`);
    return axios.get(`${this.resource_path}.json`);
  }

  static find(id) {
    console.log("find() called");
  }

  static where(params) {
    console.log("where() called");
  }

  static destroy(id) {
    console.log("destroy() called");
  }
}
