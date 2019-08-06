import {action, computed, observe, observable, runInAction, toJS} from 'mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import {getSquares, getSquareCoordinates, getSquareGrid, getSquare} from "../sources/map_tools_squares";
import L from 'leaflet';

export default class MapToolsStore {


  mapRef = null;
  drawingControl = null;

  DEFAULT_TILE_SIZE = 850;
  DEFAULT_ZOOM = 15;
  FULL_ZOOM = 18;

  cachedFeatureData = observable.map();
  @observable featureData = observable.map();
  @observable centre = [51.496667801322666, -0.13629913330078128];
  @observable zoom = this.DEFAULT_ZOOM;
  @observable tileSize = this.DEFAULT_TILE_SIZE;
  @observable squareId = null;

  constructor() {
    // observe(this, 'featureData', (change) => {
    //   const added = change.newValue.values().filter((feature) => (change.oldValue.get(feature.properties.id) === undefined));
    //   const features = added.length > 0 ? added : this.featureData.values();
    //
    //   features.map((feature) => {
    //     let leafletFeature;
    //
    //     // if the user can't edit the feature, add it as a geojson layer to the map (when switching to edit mode, it wont be possible to change or delete the polygon)
    //     if (feature.properties.userCanEdit === false || this.squareId !== feature.properties.square.id) {
    //       console.log("Adding immutable feature", feature.properties.userCanEdit, this.squareId, feature.properties.square.id);
    //       const layer = new L.geoJson(feature);
    //       // layer.addTo(this.mapRef.leafletElement);
    //       return;
    //     }
    //
    //     switch (feature.geometry.type) {
    //       case "Polygon":
    //         const coords = toJS(feature).geometry.coordinates[0].map((latlng) => [latlng[1], latlng[0]]);
    //         leafletFeature = new L.Polygon(coords);
    //         leafletFeature.properties = feature.properties;
    //         // feature.leafletFeatureElement = this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // });

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

    observe(this, 'squareId', async (change) => {
      this.squareIsLoading = true;
      console.log("square loading", this.squareIsLoading);
      const square = await getSquare(change.newValue);
      this.square = square.data;
      this.squareIsLoading = false;
      console.log(this.square.geojson.properties.centroid);
      this.centre = this.square.geojson.properties.centroid;
      console.log("square loading", this.squareIsLoading);
    })
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
  }

  @action.bound
  async createdPolygon(event) {
    console.log("created ");
    const layer = event.layer;
    const data = layer.toGeoJSON();

    const result = await createPolygon(this.squareId, data);

  }

  @action.bound
  async fetchSquareCoordinates() {
    const result = await getSquareCoordinates();

    runInAction(() => {
      this.squareCoordinates = result.data;
    })
  }

  @action.bound
  async fetchSquareGrid() {
    const result = await getSquareGrid();

    runInAction(() => {
      this.squareGrid = result.data;
    })
  }


  @action.bound async updatePolygon(id, data) {
    const result = await updatePolygon(this.squareId, id, data);
  }

  @action.bound editedPolygons(event) {
    event.layers.eachLayer((layer) => {
      const data = layer.toGeoJSON();
      data.properties = {...layer.properties};
      console.log(layer.properties, data);

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
}
