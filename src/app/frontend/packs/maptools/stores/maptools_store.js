import {intercept, observable, action, runInAction} from 'mobx/lib/mobx';
import { getPolygons, createPolygon, updatePolygon, deletePolygon } from '../sources/map_tools_polygon';

export default class MapToolsStore {
    @observable featureData = null;
    @observable centre = [51.5074, 0.1278];

    tileSize = 250;
    defaultZoom = 10;
    fullZoom = 18;

    @action.bound async fetchPolygonsForShape(id) {
        const result = await getPolygons(id);

        runInAction(() => {
            this.featureData = result.data;
        });
    }
}
