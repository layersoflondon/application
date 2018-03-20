import {observable} from "mobx";

// class Store {
//   @observable todos = [{id: 1, title: "test 1", done: false}, {id: 2, title: "Hello world", done: false}];
//   @observable filter = "";
// }
// // or
// const store = observable({
//   todos: [{id: 1, title: "test 1", done: false}, {id: 2, title: "Hello world", done: false}],
//   filter: ""
// });
// window.store = store;

export class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = 13;
}

const mapViewStore = window.mapViewStore = new MapViewStore;
export default mapViewStore;
