import {observable} from "mobx";

export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = 8;
}
