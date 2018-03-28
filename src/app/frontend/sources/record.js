import axios from 'axios';

export default class Record {
  static all() {
    console.log("all() called");
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
