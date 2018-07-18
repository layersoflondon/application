import {observable, computed} from "mobx";

/**
 * Handle's map attributes like initial position (center), the zoom level, currently visible overlay
 */
export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = null;

  @observable latlng = null;

  @observable add_record_mode = false;

  initial_position = null;

  // dom reference to the leaflet map instance (is assigned in by the map_view)
  map_ref = null;

  constructor() {
    // if we render the record_form, we should hide the place_picker component by exiting 'add_record_mode'
    // observe(this, 'overlay', (change) => {
    //   if( change.newValue === "record_form" ) {
    //
    //     this.add_record_mode = false;
    //   }
    // });

    // observe(this, 'center', (change) => {
    //   window.map_ref = this.map_ref;
    //   this.map_ref.leafletElement.panTo(new L.LatLng(...(change.newValue.toJS())))
    // });
  }

  @computed get current_bounds() {
    let center = this.map_ref.leafletElement.getBounds().getCenter();
    let radius = this.map_ref.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;
    const north_west = this.map_ref.leafletElement.getBounds().getNorthWest();
    const south_east = this.map_ref.leafletElement.getBounds().getSouthEast();
    
    return {
      top_left: north_west,
      bottom_right: south_east,
      center: center,
      radius: radius
    };
  }

  static fromJS(object) {
    let map_view_store = new MapViewStore();
    Object.assign(map_view_store, object);

    return map_view_store;
  }
}
