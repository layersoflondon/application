import {action, extendObservable, runInAction, observable, computed, observe} from "mobx";
import {MODAL_NAMES} from '../helpers/modals';

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

  @observable add_collection_mode  = false;
  @observable edit_collection_mode = false;

  initial_position = null;

  // dom reference to the leaflet map instance (is assigned in by the map_view)
  // map_ref = null;

  constructor() {
    // make any modals defined in modals::MODAL_NAMES observable props
    const modalNames = {};
    MODAL_NAMES.map((m) => modalNames[`${m}Modal`] = false);
    
    extendObservable(this, modalNames);
    // console.log(modalNames);
    
    // MODAL_NAMES.map((m) => {
    //   observe(this, `${m}Modal`, (change) => {
    //     console.log(`Got this modal: ${m}`);
    //   });
    // });

    observe(this, 'editRecordModal', (change) => {
      if(change.newValue) {
        runInAction(() => this.recordModal = false)
      }
    });

    observe(this, 'newCollectionModal', (change) => {
      runInAction(() => {
        this.inAddCollectionMode = change.newValue;
      })
    });

    observe(this, 'editCollectionModal', (change) => {
      runInAction(() => {
        this.inEditCollectionMode = change.newValue;
      })
    });
  }

  @computed get mapBounds() {
    let center = this.mapRef.leafletElement.getBounds().getCenter();
    let radius = this.mapRef.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;
    const north_west = this.mapRef.leafletElement.getBounds().getNorthWest();
    const south_east = this.mapRef.leafletElement.getBounds().getSouthEast();
    
    return {
      top_left: north_west,
      bottom_right: south_east,
      center: center,
      radius: radius
    };
  }

  @action.bound getMapBounds() {
    return new Promise((resolve) => {
      const waitForMapRef = () => {
        
        if (this.mapRef) {
          const bounds = this.mapBounds;
          resolve(bounds);
        } else {
          setTimeout(waitForMapRef, 10)
        }
      };
      
      waitForMapRef();
    });
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
    runInAction(() => {
      this[`${modal}Modal`] = value;
    });
  }

  @computed get inChoosePlaceMode() {
    return this.add_record_mode;
  }set inChoosePlaceMode(value) {
    runInAction(() => {
      this.add_record_mode = value;
      this.trayViewStore.toggleTrayVisibility();
    });
  }

  @computed get inEditRecordMode() {
    return this.edit_record_mode;
  }set inEditRecordMode(value) {
    this.edit_record_mode = value;
  }

  @computed get inAddCollectionMode() {
    return this.add_collection_mode;
  }set inAddCollectionMode(value) {
    this.add_collection_mode = value;
  }

  @computed get inEditCollectionMode() {
    return this.edit_collection_mode;
  }set inEditCollectionMode(value) {
    this.edit_collection_mode = value;
  }

  @computed get isTabletDevice() {
    return document.querySelector("meta[name=device-tablet]").content === "true";
  }
}
