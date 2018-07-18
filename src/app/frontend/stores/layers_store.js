import {observable, observe, computed} from 'mobx';
import LayerModel from '../models/layer';

export default class LayersStore {
  @observable layers = observable.map();
  @observable active_layers = observable.map();
  @observable loop_layer_id = null;

  toggleLayer(layer_id) {
    if(this.active_layers.get(layer_id)) {
      this.active_layers.remove(layer_id);
    }else {
      this.active_layers.set(layer_id, this.layers.get(layer_id));
    }
  }

  setLayers(layers) {
    this.layers = layers;
  }

  @computed get activeLayers() {
    return this.active_layers;
    //
    // // get active layer objects
    // let layers = this.layers.filter((l) => this.active_layers.indexOf(l.id)>=0);
    //
    // const sortLayers = (a, b) => {
    //   if( this.active_layers.indexOf(a.id) > this.active_layers.indexOf(b.id) ) {
    //     return 1
    //   }else if( this.active_layers.indexOf(b.id) > this.active_layers.indexOf(a.id) ) {
    //     return -1;
    //   }else {
    //     return 0;
    //   }
    // };
    //
    // // sort layer objects by the order of active_layer_ids
    // layers.sort(sortLayers);
    // return layers;
  }

  static fromJS(layers) {
    let layers_store = new LayersStore();

    layers.map((layer_data) => {
      let layer = LayerModel.fromJS(layer_data);
      layers_store.layers.set(layer.id, layer);
    });

    return layers_store;
  }

  @computed get loop_layer() {
    if( this.loop_layer_id ) {
      return this.layers.get(this.loop_layer_id);
    }

    return false;
  }
}
