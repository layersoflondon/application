import {observable, observe} from "mobx";

export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = 8;
  @observable currentCardStore = null;
  previousCardStore = null;

  constructor() {
    observe(this, "currentCardStore", (change) => {
      this.previousCardStore = change.newValue;
    });
  }
}
