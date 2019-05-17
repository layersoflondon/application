import {observable, observe, computed} from 'mobx';
import LayerGroupModel from '../models/layer_group';
import LayerGroup from '../sources/layer';

export default class LayersStore {
  @observable layer_groups = observable.map();

  @observable layer_group = null;
  @observable layer_group_id = null;

  @observable active_layer_groups =[];
  @observable loupe_layer_id = null;

  @observable loading = false;

  constructor() {
    observe(this, 'layer_group_id', (change) => {
      if( change.newValue ) {
        this.loading = true;
        LayerGroup.show(change.newValue).then((response) => {
          let layer_group = LayerGroupModel.fromJS(response.data, this);
          let current_group = this.layer_groups.get(layer_group.id);
          this.layer_group = layer_group;
          this.layer_group.is_active = current_group.is_active;
          this.layer_groups.set(layer_group.id, layer_group);
        });
      }else {
        this.loading = false;
        this.layer_group_id = null;
      }
    });
  }

  toggleLayer(layer_id) {
    let activeLayerGroups = this.active_layer_groups.slice();
    let layerGroup = activeLayerGroups.find((layerGroup) => layerGroup.id === layer_id);

    if( layerGroup ) {
      layerGroup.is_active = false;
      const index = activeLayerGroups.indexOf(layerGroup);
      activeLayerGroups.splice(index, 1);
      this.active_layer_groups = activeLayerGroups;
    }else {
      layerGroup = this.layer_groups.get(layer_id);
      layerGroup.is_active = true;
      activeLayerGroups.push(this.layer_groups.get(layer_id));
      this.active_layer_groups = activeLayerGroups;
    }

    return layerGroup.is_active;
  }

  setLayerGroups(layer_groups) {
    this.layer_groups = layer_groups;
  }

  /**
   * Set (or fetch) the given layer group ID as the current layer group
   * @param id
   */
  fetchLayerGroup(id) {
    this.layer_group_id = id;
  }

  @computed get activeLayerGroups() {
    return this.active_layer_groups.reverse();
  }

  @computed get activeVisibleLayerGroups() {
    return this.activeLayerGroups.filter((layer_group) => layer_group.is_visible);
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
