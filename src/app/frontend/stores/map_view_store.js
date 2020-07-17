import {action, extendObservable, runInAction, observable, computed, observe, toJS, intercept} from "mobx";
import {MODAL_NAMES} from '../helpers/modals';

import Cookies from 'universal-cookie';
import queryString from "query-string";

const cookies = new Cookies();

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

  @observable placeResults = observable.map();
  @observable isIntroDone = false;

  initial_position = null;

  MAX_ZOOM = 19;

  INTRO_BREAK_POINT = 1023;

  URL_ATTRIBUTES = [
    "center",
    "zoom",
    "lightsOut"
  ]

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
    
    // Round the center to 5dp.
    intercept(this, 'center', (change) => {
      if (change.newValue) {
        change.newValue = change.newValue.map((v) => parseFloat(parseFloat(v).toFixed(5)))
      }

      return change;
    })

    intercept(this, 'zoom', (change) => {
      if (change.newValue) {
        change.newValue = parseInt(change.newValue);
      }
      return change;
    })

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

    observe(this, 'isIntroDone', (change) => {
      const date = new Date();
      const year = date.getUTCFullYear();
      const expiryDate = new Date(year+1, date.getMonth(), date.getDate());
      cookies.set("introDone", change.newValue, {path: '/map', expires: expiryDate});
    });

    this.isIntroDone = cookies.get('introDone') === 'true';

    if (this.URL_ATTRIBUTES) {
      this.URL_ATTRIBUTES.forEach((attr) => {
        observe(this, attr, (change) => {
          if (change.newValue) {
            this.pushUrlParam()
          }
        })
      })
    }

  }

  @computed get urlAttributes() {
    let attrs = {}
    this.URL_ATTRIBUTES.forEach((attr) => {
      attrs[attr] = this[attr]
    })
    return attrs
  }

  pushUrlParam() {
    // Get the current params
    let params = queryString.parse(location.search)
    // replace the param for the name of the class this is mixed into
    params[this.constructor.name] = btoa(JSON.stringify(this.urlAttributes))
    // set the search querystring to this new thing.
    window.history.pushState({},window.title, `${location.pathname}?${queryString.stringify(params)}`)
  }

  @computed get mapBounds() {
    let center = this.mapRef.leafletElement.getCenter();
    let radius = this.mapRef.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;
    const north_west = this.mapRef.leafletElement.getBounds().getNorthWest();
    const south_east = this.mapRef.leafletElement.getBounds().getSouthEast();
    const zoom = this.mapRef.leafletElement.getZoom();

    for(const [k,v] of Object.entries(center)) {
      center[k] = parseFloat(parseFloat(v).toFixed(5))
    }
    
    return {
      top_left: north_west,
      bottom_right: south_east,
      center: center,
      radius: radius,
      zoom: zoom
    };
  }

  @computed get mapZoom() {
    return this.mapRef.leafletElement.getZoom();
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

  @action.bound getMapZoom() {
    return new Promise((resolve) => {
      const waitForMapRef = () => {

        if (this.mapRef) {
          const zoom = this.mapZoom;
          resolve(zoom);
        } else {
          setTimeout(waitForMapRef, 10)
        }
      };

      waitForMapRef();
    });
  }




  @computed get shouldShowIntro() {
    const desktopLayout = window.innerWidth>this.INTRO_BREAK_POINT;

    return desktopLayout && !this.isIntroDone;
  }

  panTo(lat, lng, zoom = null) {
    this.initial_position = this.center;
    this.center.replace([lat, lng]);

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

  @computed get places() {
    return this.placeResults;
  }set places(value) {
    const places = observable.map();

    value.map((place) => {
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      const place_type = place.address[place.type] || place.address.road;
      const display_name = `${place_type}<br/>${place.address.city}`;

      const placeObject = {
        lat: lat,
        lon: lon,
        position: [lat, lon],
        name: place.namedetails.name,
        display_name: display_name,
        osm_type: place.osm_type,
        svg: place.svg
      };

      places.set(place.place_id, placeObject);
    });

    this.placeResults.replace(places);
  }
}
