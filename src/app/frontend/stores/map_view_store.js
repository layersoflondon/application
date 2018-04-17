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

  @observable add_record_mode = false;

  constructor() {
    // if we render the record_form, we should hide the place_picker component by exiting 'add_record_mode'
    observe(this, 'overlay', (change) => {
      if( change.newValue === "record_form" ) {
        this.add_record_mode = false;
      }
    });
  }
}
