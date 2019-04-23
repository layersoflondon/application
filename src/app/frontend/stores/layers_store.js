import {observable, observe, computed} from 'mobx';
import LayerGroupModel from '../models/layer_group';

export default class LayersStore {
  @observable layer_groups = observable.map();
  @observable active_layers = observable.map();
  @observable loupe_layer_id = null;

  toggleLayer(layer_id) {
    if(this.active_layers.get(layer_id)) {
      this.active_layers.delete(layer_id);
    }else {
      this.active_layers.set(layer_id, this.layer_groups.get(layer_id));
    }
  }

  setLayers(layer_groups) {
    this.layer_groups = layer_groups;
  }

  @computed get activeLayers() {
    return this.active_layers;
    //
    // // get active layer objects
    // let layers = this.layer_groups.filter((l) => this.active_layers.indexOf(l.id)>=0);
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

  static fromJS(layer_groups) {
    let layers_store = new LayersStore();

    layer_groups.map((layer_group) => {
      let layer = LayerGroupModel.fromJS(layer_group);
      layers_store.layer_groups.set(layer.id, layer);
    });

    return layers_store;
  }

  @computed get loupe_layer() {
    if( this.loupe_layer_id ) {
      return this.layer_groups.get(this.loupe_layer_id);
    }

    return false;
  }
}
