import {action, computed, observe, observable, runInAction, toJS} from 'mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import {getSquares, getSquareCoordinates, getSquareGrid, getSquare} from "../sources/map_tools_squares";

export default class MapToolsStore {

  @observable mapRef = null;

  DEFAULT_ZOOM = 15;
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

    observe(this, 'square', (change) => {
      const setCenter = () => {
        if (this.mapRef && this.squareIsLoading === false) {
          this.mapRef.leafletElement.flyTo(change.newValue.geojson.properties.centroid.slice(), this.FULL_ZOOM);

        } else {
          setTimeout(setCenter, 100)
        }
      };

      if (change.newValue) setCenter();
    });

    observe(this, 'showShapes', (change) => {
      const polygon_layers = Object.values(this.mapRef.leafletElement._layers).filter((layer)=>layer.hasOwnProperty('editing'));

      if( change.newValue === true ) {
        polygon_layers.map((layer) => layer.setStyle({fillOpacity: 0.2, opacity: 0.6}));
      }else {
        polygon_layers.map((layer) => layer.setStyle({fillOpacity: 0, opacity: 0}));
      }
    });
  }

  @computed get editableFeatures() {
    return this.featureData.values().filter((feature) => {
      return feature.properties.id && feature.properties.userCanEdit && (this.squareId === feature.properties.square.id);
    });
  }

  @computed get immutableFeatures() {
    if( !this.atEditableSquare ) {
      return this.featureData.values();
    } else {
      return this.featureData.values().filter((feature) => {
        return !feature.properties.userCanEdit || (this.squareId !== feature.properties.square.id);
      });
    }
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
    return this.squareId !== null;
  }

  @computed get atEditableSquare() {
    return this.isZoomed && this.square && this.square.state.label === 'in_progress';
  }

  @action.bound setEditingMode(enabled) {
    this.inEditOrDrawingMode = enabled;
  }

  @action.bound toggleShowShapes() {
    this.showShapes = !this.showShapes;
  }
}
