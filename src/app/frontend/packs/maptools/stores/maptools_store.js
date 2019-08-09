import {action, computed, observe, observable, runInAction, toJS} from 'mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import {getSquares, getSquareCoordinates, getSquareGrid, getSquare} from "../sources/map_tools_squares";
import L from 'leaflet';

export default class MapToolsStore {

  @observable mapRef = null;

  DEFAULT_TILE_SIZE = 850;
  DEFAULT_ZOOM = 13;
  FULL_ZOOM = 18;

  cachedFeatureData = observable.map();
  @observable featureData = observable.map();
  @observable centre = [51.496667801322666, -0.13629913330078128];
  @observable zoom = this.DEFAULT_ZOOM;
  @observable tileSize = this.DEFAULT_TILE_SIZE;
  @observable squareId = null;
  @observable squareIsLoading;
  @observable square;
  @observable inEditOrDrawingMode = false;
  @observable showShapes = true;

  constructor() {
    observe(this, 'centre', (change) => {
      const setCenter = () => {
        if (this.mapRef && this.squareIsLoading === false) {
          this.mapRef.leafletElement.panTo(change.newValue.slice());
        } else {
          setTimeout(setCenter, 100)
        }
      };

      if (change.newValue) setCenter();


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

  @computed get isZoomed() {
    return typeof this.squareId !== "undefined";
  }

  @computed get atEditableSquare() {
    return this.isZoomed && this.square && this.square.state.label === 'in_progress';
  }

  @action.bound setEditingMode(enabled) {
    this.inEditOrDrawingMode = enabled;
  }
}
