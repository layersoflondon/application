import {action, computed, observable, observe, runInAction} from 'mobx';
import LayerGroupModel from '../models/layer_group';
import Layer from '../sources/layer';

export default class LayersStore {
  @observable layer_groups = observable.map();

  @observable layer_group = null;
  @observable layer_group_id = null;

  @observable layer_group_order = [];
  @observable loupe_layer_id = null;

  @observable loading = false;

  @observable currentPage = 1;

  constructor() {
    observe(this, 'layer_group_id', (change) => {
      if( change.newValue ) {
        this.loading = true;
        Layer.show(change.newValue).then((response) => {
          let layer_group = LayerGroupModel.fromJS(response.data, this);
          let current_group = this.layer_groups.get(layer_group.id);
          this.layer_group = layer_group;

          if(current_group) {
            this.layer_group.highlighted = current_group.highlighted;
            this.layer_group.is_active = current_group.is_active;
          }
          
          this.layer_groups.set(layer_group.id, layer_group);
        });
      }else {
        this.loading = false;
        this.layer_group_id = null;
      }
    });
  }

  @action.bound toggleLayer(layer_id) {
    let layerGroup = this.activeLayerGroups.find((layerGroup) => layerGroup.id === layer_id);

    if( layerGroup ) {
      layerGroup.is_active = false;
    }else {
      layerGroup = this.layer_groups.get(layer_id);

      /*
      figure out whether we're rendering a group of mixed layer types and switch off any geojson ones, or
      whether we're rendering just geojson layers and switch off all but the first one
       */
      if( layerGroup.layers.length > 1 ) {
        const geojsonLayers = layerGroup.layers.filter((layer) => layer.layer_type === 'geojson');

        if( layerGroup.layers.length === geojsonLayers.length ) { // all geojson
          geojsonLayers.slice(1, geojsonLayers.length).map((layer)=>layer.opacity=0);
        }else { // mixed
          geojsonLayers.map((layer)=>layer.opacity=0);
        }
      }

      layerGroup.is_active = true;
    }

    return layerGroup.is_active;
  }

  @action.bound clearActiveLayerGroups() {
    runInAction(() => {
      return this.layer_groups.values().map((layer_group) => layer_group.is_active = false);
    })
  }

  /**
   * Set (or fetch) the given layer group ID as the current layer group
   * @param id
   */
  fetchLayerGroup(id) {
    this.layer_group_id = id;
  }

  @action.bound search(query, replaceResults, doneCallback) {
    Layer.search(query).then((response) => {
      const queryGiven = !!(query.query && query.query.length);
      const filtersGiven = Object.keys(query).filter((k)=>k!=="query").length>0;

      const layerGroups = response.data.map((layer) => {
        // layer.highlighted = false; // ensure all results are rendered in the same list, without a highlighted section
        return LayerGroupModel.fromJS(layer, this);
      });

      if(replaceResults) {
        this.layer_groups.clear();
      }

      layerGroups.map((group) => this.layer_groups.set(group.id, group));

      if(doneCallback)  {
        doneCallback({totalPages: parseInt(response.headers['x-total-pages'], 10)});
      }
    });
  }

  // layer groups that can be rendered on the overlay
  @computed get activeLayerGroups() {
    return this.layer_groups.values().filter((layer_group) => layer_group.is_active).reverse();
  }

  // layer groups that the user has activated
  @computed get activeVisibleLayerGroups() {
    const layers = this.activeLayerGroups.filter((layer_group) => layer_group.is_visible);

    if( this.layer_group_order.length && this.layer_group_order.length === layers.length ) {
      layers.sort((a,b) => {
        if(this.layer_group_order.indexOf(a.id) > this.layer_group_order.indexOf(b.id)) {
          return 1;
        }else {
          return -1;
        }
      });
    }

    return layers;
  }

  // layers that are highlighted
  @computed get highlightedLayerGroups() {
    return this.layer_groups.values().filter((l) => l.highlighted);
  }

  // layers that aren't highlighted
  @computed get layerGroups() {
    return this.layer_groups.values().filter((l) => !l.highlighted);
  }

  @computed get sortedLayerGroups() {
    const active = this.activeLayerGroups;
    return active;
  }

  static fromJS(layer_groups) {
    let layers_store = new LayersStore();

    layer_groups.map((layer_group) => {
      let layer = LayerGroupModel.fromJS(layer_group);
      layers_store.layer_groups.set(layer.id, layer);
    });

    return layers_store;
  }

  addLayerGroups(layer_groups) {
    layer_groups.map((layer_group) => {
      let layer = LayerGroupModel.fromJS(layer_group);
      this.layer_groups.set(layer.id, layer);
    });
  }

  @computed get loupe_layer() {
    if( this.loupe_layer_id ) {
      return this.layer_groups.get(this.loupe_layer_id);
    }

    return false;
  }
}
