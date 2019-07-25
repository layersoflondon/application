import {action, observe, observable, reaction, runInAction} from 'mobx/lib/mobx';
import { getPolygons, getAllPolygons, createPolygon, updatePolygon, deletePolygon } from '../sources/map_tools_polygon';
import L from 'leaflet';

export default class MapToolsStore {
    @observable featureData = observable.map();
    @observable centre = [51.5074, 0.1278];

    mapRef = null;
    tileSize = 250;
    defaultZoom = 10;
    fullZoom = 18;

    constructor() {
        observe( this, 'featureData', (change) => {
            const removed = change.oldValue.values().filter((feature) => change.newValue.get(feature.properties.id) === undefined);
            const added   = change.newValue.values().filter((feature) => change.oldValue.get(feature.properties.id) === undefined);

            added.map((feature) => {
                L.geoJson(feature).addTo(this.mapRef.leafletElement);
            });

            removed.map((feature) => {
                const removedFeatures = Object.values(this.mapRef.leafletElement._layers).filter((layer) => {
                    return layer.hasOwnProperty('feature') && layer.feature.properties.id === feature.properties.id;
                });

                removedFeatures.map((feature) => this.mapRef.leafletElement.removeLayer(feature));
            });
        });
    }

    @action.bound removeFeature(id) {
        const features = observable.map();
        this.featureData.keys().map((id) => features.set(id, this.featureData.get(id)));
        features.delete(id);
        this.featureData = features;
    }

    @action.bound async fetchPolygonsForSquare(id) {
        let result;
        if( id ) {
            result = await getPolygons(id);
        }else {
            result = await getAllPolygons(id);
        }

        runInAction(() => {
            const features = observable.map();

            result.data.features.map((feature) => {
                features.set(feature.properties.id, feature);
            });

            this.featureData = features;
        });
    }

    @action.bound async createFeature(square_id, feature) {
        const result = await createPolygon(square_id, feature);

        runInAction(() => {
            const features = this.featureData.slice();
            features.push(result.data);
            this.featureData = features;
        });
    }
}
