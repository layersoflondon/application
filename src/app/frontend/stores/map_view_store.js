import {observable, observe} from "mobx";

/**
 * Handle's map attributes like initial position (center), the zoom level, currently visible overlay
 */
export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = 1;
  @observable overlay = null;
  @observable visible_record_id = null;

  @observable latlng = null;
}
