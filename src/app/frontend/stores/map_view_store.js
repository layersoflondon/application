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
    let map = this.map_ref;
    let center = map.leafletElement.getBounds().getCenter();
    let radius = map.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;

    const north_west = map.leafletElement.getBounds().getNorthWest();
    const south_east = map.leafletElement.getBounds().getSouthEast();

    const bounds = {
      center: {lat: center.lat, lng: center.lng},
      top_left: {lat: north_west.lat, lng: north_west.lng},
      bottom_right: {lat: south_east.lat, lng: south_east.lng},
      radius: radius
    };

    return bounds;
  }

  panTo(lat, lng, zoom = null) {
    this.initial_position = this.center;
    this.center = [lat, lng];

    if(zoom) {
      this.zoom = zoom;
    }
  }

  static fromJS(object) {
    let map_view_store = new MapViewStore();
    Object.assign(map_view_store, object);

    return map_view_store;
  }
}
