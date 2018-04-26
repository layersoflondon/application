import {observable, observe, computed} from 'mobx';
import Record from '../sources/record';
import RecordModel from "../models/record";

export default class LayersStore {
  @observable layers = [];
  @observable active_layer_ids = [];

  toggleLayer(layer_id) {
    let layer_ids = this.active_layer_ids;
    const layer_index = layer_ids.indexOf(layer_id);

    if( layer_index >= 0 ) {
      layer_ids.splice(layer_index, 1);
    }else {
      layer_ids.push(layer_id);
    }

    this.active_layer_ids = layer_ids;
  }

  @computed get activeLayers() {
    return this.layers.filter((l) => this.active_layer_ids.indexOf(l.id)>=0);
  }
}
