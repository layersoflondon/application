import {action, computed, observe, observable, runInAction, toJS} from 'mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import {getSquares, getSquareCoordinates, getSquareGrid, getSquare} from "../sources/map_tools_squares";

export default class MapToolsStore {

  @observable mapRef = null;
  editControl = null;
  editableFeatureGroup = null;

  DEFAULT_ZOOM = 13;
  FULL_ZOOM = 18;
  WELCOME_ZOOM = 15;

  cachedFeatureData = observable.map();
  @observable featureData = observable.map();
  @observable centre = [51.496667801322666, -0.13629913330078128];
  @observable zoom = this.DEFAULT_ZOOM;
  @observable squareId = null;
  @observable squareIsLoading;
  @observable square;
  @observable inEditOrDrawingMode = false;
  @observable inDeleteMode = false;
  @observable showShapes = true;
  @observable renderState = null;

  user = null;

  constructor() {
    observe(this, 'zoom', (change) => {
      const setZoom = () => {
        if (this.mapRef) {
          this.mapRef.leafletElement.setZoom(change.newValue);
        } else {
          setTimeout(setZoom, 100)
        }
      };

      if (change.newValue) setZoom();
    })

    observe(this, 'square', (change) => {
      const setCenter = () => {
        if (this.mapRef && this.squareIsLoading === false) {
          this.mapRef.leafletElement.flyTo(change.newValue.geojson.properties.centroid.slice(), this.FULL_ZOOM);
        } else {
          setTimeout(setCenter, 100)
        }
      };

      const setOverview = () => {
        if (this.mapRef) {
          this.mapRef.leafletElement.flyTo(change.oldValue.geojson.properties.centroid.slice(), this.DEFAULT_ZOOM);
        } else {
          setTimeout(setOverview, 100)
        }
      };

      if (change.newValue) {
        setCenter();

        this.setRenderStateForSquare(change.newValue, this.user);
      } else {
        setOverview();
      }
    });

    observe(this, 'showShapes', (change) => {
      if( change.newValue === true ) {
        this.polygonLayers.map((layer) => layer.setStyle({fillOpacity: 0.2, opacity: 0.6}));
      }else {
        this.polygonLayers.map((layer) => layer.setStyle({fillOpacity: 0, opacity: 0}));
      }
    });
  }

  // given the current state of a square, the front end component will render a function that matches the
  // state.label name (ie renderState_done() is called for 'done' state.
  // if the state is 'done', we need to have the square verified by a different user so we return 'doneCheck' in this case
  @action.bound setRenderStateForSquare(square, user) {
    if( square.state.label === 'done' && square.state.user.id !== user.id ) {
      this.renderState = 'doneCheck';
    }else {
      this.renderState = square.state.label;
    }
  }

  @action.bound overrideRenderStateForSquare(state) {
    this.renderState = state;
  }

  @computed get renderStateForSquare() {
    return this.renderState;
  }

  @computed get editableFeatures() {
    return this.featureData.values().filter((feature) => {

      let withinEditableRange = false;

      if(window.__EDITABLE_ADJACENT_RANGE > 0 ) {
        var width = parseInt(window.__MAPTOOLS_GRID_WIDTH, 10);
        var range = parseInt(window.__EDITABLE_ADJACENT_RANGE, 10);

        var currentRow = Math.ceil(this.squareId/width);
        
        var previousRowWindow = 5;
        var northWestSquareId = 1;

        if(this.squareId > width) {
          northWestSquareId = this.squareId - (width * range) - range;
        }

        if(currentRow <= range) {
          previousRowWindow = previousRowWindow-range;
        }

        for(var i = 0; i<previousRowWindow ; i++) {
          var previousRange_min = northWestSquareId + (i * width)
          var previousRange_max = northWestSquareId + ((i * width) + width/2-1)

          if( feature.properties.square.id >= previousRange_min && feature.properties.square.id <= previousRange_max) {
            withinEditableRange = true;
            break;
          }
        }
      }

      return feature.properties.id && feature.properties.userCanEdit && withinEditableRange;
    });
  }

  @computed get immutableFeatures() {
    if( !this.atEditableSquare ) {
      return this.featureData.values();
    } else {
      return this.featureData.values().filter((feature) => {
        return !feature.properties.userCanEdit;
      });
    }
  }

  @computed get polygonLayers() {
    return Object.values(this.mapRef.leafletElement._layers).filter((layer) => {
      const hasPath = layer.hasOwnProperty('_path');

      if( !hasPath ) return false;

      const isInteractiveLayer = layer._path.classList.contains('leaflet-interactive');
      const isMaskingSquare = layer._path.classList.contains('masking-square');

      return hasPath && (isInteractiveLayer && !isMaskingSquare);
    });
  }

  @action.bound removeFeature(id) {
    const features = observable.map();
    this.featureData.keys().map((id) => features.set(id, this.featureData.get(id)));
    features.delete(id);
    this.featureData = features;
  }

  @action.bound
  async fetchPolygons() {
    const result = await getAllPolygons();

    runInAction(() => {
      const features = observable.map();

      result.data.features.map((feature) => {
        features.set(feature.properties.id, feature);
      });

      this.cachedFeatureData = features;
    });

    return true;
  }

  @action.bound
  async fetchSquares() {
    const result = await getSquares();

    runInAction(() => {
      this.squares = result.data;
    })
  }

  @action.bound setPolygons(polygon_data) {
    const features = observable.map();

    if (!polygon_data) {
      const data = this.featureData.values().length > 0 ? this.featureData.values() : this.cachedFeatureData.values();
      polygon_data = {features: data};

    }

    polygon_data.features.map((feature) => {
      features.set(feature.properties.id, feature);
    });

    this.featureData = features;
  }

  @action.bound setZoom(zoomLevel) {
    this.zoom = zoomLevel;
  }

  @action.bound zoomOut() {
    this.zoom = this.DEFAULT_ZOOM;
    this.squareId = null;
  }

  @action.bound setCentre(centre) {
    this.centre = centre;
  }

  @action.bound setZoomAndCentre(zoomLevel, centrePoint) {
    this.zoom = zoomLevel;
    this.centre = centrePoint;
  }

  @action.bound setSquare(id) {
    this.squareId = id;
    this.zoom = this.FULL_ZOOM;
  }

  @action.bound async createdPolygon(event) {
    const layer = event.layer;
    const data = layer.toGeoJSON();

    const result = await createPolygon(this.squareId, data);

    runInAction(() => {
      // add the saved polygon, with our custom properties into the store
      const features = observable.map();
      this.featureData.keys().map((id) => features.set(id, this.featureData.get(id)));
      features.set(result.data.properties.id, result.data);
      // to avoid duplicating the shape, remove the one created by leaflet.draw
      // our re-render will draw a polygon from the features.map
      layer.removeFrom(this.mapRef.leafletElement);

      this.featureData = features;
    });
  }

  @action.bound async fetchSquareCoordinates() {
    const result = await getSquareCoordinates();

    runInAction(() => {
      this.squareCoordinates = result.data;
    })
  }

  @action.bound async fetchSquareGrid() {
    const result = await getSquareGrid();

    runInAction(() => {
      this.squareGrid = result.data;
    });
  }

  @action.bound async updatePolygon(id, data) {
    const result = await updatePolygon(this.squareId, id, data);
  }

  @action.bound editedPolygons(event) {
    event.layers.eachLayer((layer) => {
      const data = layer.toGeoJSON();
      data.properties = {...layer.properties};
      updatePolygon(this.squareId, layer.properties.id, data);
    });
  }

  @action.bound deletedPolygons(event) {
    event.layers.eachLayer((layer) => {
      deletePolygon(this.squareId, layer.properties.id);
    });
  }

  @action.bound setUser(user) {
    this.user = user;
  }

  @computed get isZoomed() {
    return this.squareId !== null;
  }

  @computed get atEditableSquare() {
    return this.isZoomed && this.square && this.square.state.label === 'in_progress';
  }

  @action.bound setEditingMode(enabled) {
    this.inEditOrDrawingMode = enabled;
  }

  @action.bound setDeleteMode(enabled) {
    this.inDeleteMode = enabled;
  }

  @action.bound toggleShowShapes() {
    this.showShapes = !this.showShapes;
  }
}
