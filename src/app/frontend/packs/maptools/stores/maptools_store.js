import {action, observe, observable, runInAction, toJS} from 'mobx/lib/mobx';
import {getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon} from '../sources/map_tools_polygon';
import L from 'leaflet';

export default class MapToolsStore {
    cachedFeatureData = observable.map();
    @observable featureData = observable.map();
    @observable centre = [51.5074, 0.1278];

    mapRef = null;
    tileSize = 250;
    defaultZoom = 10;
    fullZoom = 18;

    constructor() {
        observe( this, 'featureData', (change) => {
            // console.log(change.oldValue.keys(), change.newValue.keys(), this.featureData.keys());
            const added   = change.newValue.values().filter((feature) => (change.oldValue.get(feature.properties.id) === undefined));

            // if( !this.mapRef) return;

            const features = added.length > 0 ? added : this.featureData.values();

            features.map((feature) => {
                let leafletFeature;

                // if the user can't edit the feature, add it as a geojson layer to the map (when switching to edit mode, it wont be possible to change or delete the polygon)
                if( !feature.properties.userCanEdit ) {
                    const layer = new L.geoJson(feature);
                    layer.addTo(this.mapRef.leafletElement);
                    return;
                }

                window.leafletElement = this.mapRef.leafletElement;
                switch(feature.geometry.type) {
                    case "Polygon":
                        console.log("Add polygon");
                        const coords = toJS(feature).geometry.coordinates[0].map((latlng) => [latlng[1],latlng[0]]);
                        leafletFeature = new L.Polygon(coords);
                        leafletFeature.properties = feature.properties;
                        this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                        break;
                    case "Point":
                        leafletFeature = new L.Circle([toJS(feature).geometry.coordinates[1], toJS(feature).geometry.coordinates[0]], feature.properties.radius);
                        leafletFeature.properties = feature.properties;
                        console.log(feature.properties);
                        this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                        break;
                    default:
                        console.log(`not handling ${feature.geometry.type}`);
                }
                // if( feature.geometry.type === "Polygon" ) {
                //     const coords = toJS(feature).geometry.coordinates[0].map((latlng) => [latlng[1],latlng[0]]);
                //     leafletFeature = new L.Polygon(coords);
                //     leafletFeature.properties = feature.properties;
                //
                //     this.mapRef.leafletElement.editableItems.addLayer(leafletFeature);
                // }else {
                //     // leafletFeature = L.geoJson(feature);
                //     window.leafletElement = this.mapRef.leafletElement;
                //     console.log(`Skipping unsupported feature type ${feature.geometry.type}`, feature);
                // }
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
}
