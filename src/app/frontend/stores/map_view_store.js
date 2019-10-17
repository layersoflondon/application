import {action, extendObservable, runInAction, observable, computed} from "mobx";
import {MODAL_NAMES} from '../helpers/modals';
import { observer } from "mobx-react";

/**
 * Handle's map attributes like initial position (center), the zoom level, currently visible overlay
 */
export default class MapViewStore {
  @observable center = [51.505, -0.09];
  @observable zoom = null;

  @observable latlng = null;
  @observable lightsOut = false;

  @observable add_record_mode = false;
  @observable edit_record_mode = false;

  initial_position = null;

  // dom reference to the leaflet map instance (is assigned in by the map_view)
  // map_ref = null;

  constructor() {
    // make any modals defined in modals::MODAL_NAMES observable props
    const modalNames = {};
    MODAL_NAMES.map((m) => modalNames[`${m}Modal`] = null);
    extendObservable(this, modalNames);
  }

  @computed get current_bounds() {
    console.log("current_bounds() called");
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

  modalIsVisible(modal) {
    return this[`${modal}Modal`];
  }

  @action.bound toggleModal(modal, value) {
    const visible = value || !this[`${modal}Modal`];
    this[`${modal}Modal`] = visible;
  }

  @action.bound setChoosePlaceMode(enabled) {
    runInAction(() => {
      this.add_record_mode = enabled;
      this.trayViewStore.toggleTrayVisibility();
    });
  }

  @action.bound setRecordEditMode(enabled) {
    runInAction(() => {
      this.edit_record_mode = enabled;
    })
  }

  @computed get inChoosePlaceMode() {
    return this.add_record_mode;
  }

  @computed get inEditRecordMode() {
    return this.edit_record_mode;
  }
}
