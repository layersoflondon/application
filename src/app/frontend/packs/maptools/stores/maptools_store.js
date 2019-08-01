import {action, computed, observe, observable, runInAction, toJS} from 'mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import L from 'leaflet';

export default class MapToolsStore {
    mapRef = null;
    drawingControl = null;

    DEFAULT_TILE_SIZE = 250;
    DEFAULT_ZOOM = 10;
    FULL_ZOOM = 18;

    cachedFeatureData = observable.map();
    @observable featureData = observable.map();
    @observable centre = [51.51066556016948,0.12187957763671876];
    @observable zoom = this.DEFAULT_ZOOM;
    @observable tileZize = this.DEFAULT_TILE_SIZE;
    @observable squareId = null;

    constructor() {
        observe( this, 'featureData', (change) => {
            const added   = change.newValue.values().filter((feature) => (change.oldValue.get(feature.properties.id) === undefined));
            const features = added.length > 0 ? added : this.featureData.values();

            features.map((feature) => {
                let leafletFeature;

                // if the user can't edit the feature, add it as a geojson layer to the map (when switching to edit mode, it wont be possible to change or delete the polygon)
                if( feature.properties.userCanEdit === false || this.squareId !== feature.properties.square.id ) {
                    console.log("Adding immutable feature", feature.properties.userCanEdit, this.squareId, feature.properties.square.id);
                    const layer = new L.geoJson(feature);
                    layer.addTo(this.mapRef.leafletElement);
                    return;
                }

                console.log("Adding editable feature");

                switch(feature.geometry.type) {
                    case "Polygon":
                        const coords = toJS(feature).geometry.coordinates[0].map((latlng) => [latlng[1],latlng[0]]);
                        leafletFeature = new L.Polygon(coords);
                        leafletFeature.properties = feature.properties;
                        feature.leafletFeatureElement = this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                        break;
                    case "Point":
                        leafletFeature = new L.Circle([toJS(feature).geometry.coordinates[1], toJS(feature).geometry.coordinates[0]], feature.properties.radius);
                        leafletFeature.properties = feature.properties;
                        this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                        feature.leafletFeatureElement = this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    @action.bound removeFeature(id) {
        const features = observable.map();
        this.featureData.keys().map((id) => features.set(id, this.featureData.get(id)));
        features.delete(id);
        this.featureData = features;
    }

    @action.bound async fetchPolygons() {
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

    @action.bound setPolygons(polygon_data) {
        const features = observable.map();

        if( !polygon_data ) {
            const data = this.featureData.values().length>0 ? this.featureData.values() : this.cachedFeatureData.values();
            polygon_data = {features: data};
        }

        polygon_data.features.map((feature) => {
            features.set(feature.properties.id, feature);
        });

        this.featureData = features;
    }

    @action.bound async createFeature(square_id, feature) {
        const result = await createPolygon(square_id, feature);

        runInAction(() => {
            const features = observable.map();
            this.featureData.keys().map((id) => features.set(id, this.featureData.get(id)));
            features.set(result.data.properties.id, result.data);

            this.featureData = features;
        });
    }

    @action.bound async updateFeature(square_id, id, feature) {
        const result = await updatePolygon(square_id, id, feature);
    }

    @action.bound async deleteFeature(square_id, id) {
        const result = await deletePolygon(square_id, id);
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

    @action.bound addDrawingUIToMap() {
        this.mapRef.leafletElement.addControl(this.drawingControl);
    }

    @action.bound setZoomAndCentre(zoomLevel, centrePoint) {
        this.zoom = zoomLevel;
        // this.centre = centrePoint;
    }

    @action.bound setSquare(id) {
        this.squareId = id;
    }

    @computed get isZoomed() {
        return typeof this.squareId !== "undefined";
    }
}
