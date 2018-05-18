import {observable, observe} from "mobx";

/**
 * Handle's map attributes like initial position (center), the zoom level, currently visible overlay
 */
export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = 1;
  @observable overlay = null;

  @observable latlng = null;

  @observable add_record_mode = false;

  initial_position = null;

  constructor() {
    // if we render the record_form, we should hide the place_picker component by exiting 'add_record_mode'
    observe(this, 'overlay', (change) => {
      if( change.newValue === "record_form" ) {

        this.add_record_mode = false;
      }
    });

    // observe(this, 'center', (change) => {
    //   window.map_ref = this.map_ref;
    //   this.map_ref.leafletElement.panTo(new L.LatLng(...(change.newValue.toJS())))
    // });
  }

  panTo(lat, lng) {
    this.initial_position = this.center;
    this.center = [lat, lng];
  }

  static fromJS(object) {
    let map_view_store = new MapViewStore();
    Object.assign(map_view_store, object);

    return map_view_store;
  }
}
