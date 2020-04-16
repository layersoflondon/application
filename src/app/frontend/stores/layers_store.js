import {action, computed, observable, observe, runInAction} from 'mobx';
import LayerGroupModel from '../models/layer_group';
import Layer from '../sources/layer';

export default class LayersStore {
  @observable layer_groups = observable.map();
  @observable all_layer_groups = observable.map();

  @observable layer_group = null;
  @observable layer_group_id = null;

  @observable layer_group_order = [];
  @observable loupe_layer_id = null;

  @observable loading = false;

  @observable currentPage = 1;

  @observable free_text_query = null;
  @observable total_search_result_pages = 1;
  @observable search_page = 1;

  @observable active_layer_group_ids = [];

  @observable category_and_term_filters = {term_id: null, category_id: null};

  
  constructor() {
    observe(this, 'layer_group_id', (change) => {
      if( change.newValue ) {
        this.loading = true;
        Layer.show(change.newValue).then((response) => {
          let layer_group = LayerGroupModel.fromJS(response.data, this);
          let current_group = this.all_layer_groups.get(layer_group.id);
          this.layer_group = layer_group;

          if(current_group) {
            this.layer_group.highlighted = current_group.highlighted;
            this.layer_group.is_active = current_group.is_active;
          }
          
          this.layer_groups.set(layer_group.id, layer_group);
          this.all_layer_groups.set(layer_group.id, layer_group);
          this.loading = false;
        });
      }else {
        this.loading = false;
        this.layer_group_id = null;
      }
    });
    
    observe(this, 'free_text_query', (change) => {
        this.search();
    });
    observe(this, 'search_page', (change) => {
      if (change.oldValue !== null) {
        this.search(true);
      }
    });

    observe(this,'active_layer_group_ids', (change) => {
      this.all_layer_groups.values().map((group) => {
        group.is_active = this.active_layer_group_ids.includes(group.id)
      });
    });

    observe(this, 'category_and_term_filters', (change) => {
      this.search();
    });

  }

  @action.bound toggleLayer(layer_id) {
    let layerGroup = this.activeLayerGroups.find((layerGroup) => layerGroup.id === layer_id);

    if( layerGroup ) {
      const index = this.active_layer_group_ids.indexOf(layerGroup.id);
      if (index > -1) {
        this.active_layer_group_ids.splice(index, 1);
      }
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

      if (this.active_layer_group_ids.indexOf(layerGroup.id) === -1) {
        this.active_layer_group_ids.push(layerGroup.id);
      }

     layerGroup.is_active = true

    }

    return layerGroup.is_active;
  }

  @action.bound clearActiveLayerGroups() {
    runInAction(() => {
      this.layer_groups.values().map((layer_group) => layer_group.is_active = false);
      this.all_layer_groups.values().map((layer_group) => layer_group.is_active = false);
      this.active_layer_group_ids = [];
    })
  }

  /**
   * Set (or fetch) the given layer group ID as the current layer group
   * @param id
   */
  fetchLayerGroup(id) {
    this.layer_group_id = id;
  }

  /** Search for layer groups, using the category id, term id and free-text search**/
  /** We build up a list of all layer groups we've ever seen, and a separate observable map which is reset to only show the results from this particular search **/
  @action.bound async search(append) {
    this.loading = true;
    const query = {
      category_id: this.category_and_term_filters.category_id,
      term_id: this.category_and_term_filters.term_id,
      query: this.free_text_query,
      page: this.search_page
    };

    await Layer.search(query).then((response) => {
      const layerGroups = response.data.map((layer) => {
        return LayerGroupModel.fromJS(layer, this);
      });

      if (!!!append) {
        this.layer_groups.clear()
      }
      layerGroups.map((group) => {
        group.is_active = this.active_layer_group_ids.includes(group.id);
        this.layer_groups.set(group.id, group);
        this.all_layer_groups.set(group.id, group);
      });


      this.total_search_result_pages = parseInt(response.headers['x-total-pages'], 10);
      this.search_page = parseInt(response.headers['x-page'],10);
      this.loading = false;
    });
  }

  @action.bound setFilters(filters) {
    const defaults = {term_id: null, category_id: null};
    this.category_and_term_filters = {...defaults, ...filters};
  }

  @computed get searchQueriesPresent() {
    return (this.searchFiltersPresent || this.free_text_query)
  }

  @computed get searchFiltersPresent() {
    return (this.category_and_term_filters.category_id || this.category_and_term_filters.term_id)
  }

  // layer groups that can be rendered on the overlay
  @computed get activeLayerGroups() {
    return this.all_layer_groups.values().filter((layer_group) => this.active_layer_group_ids.includes(layer_group.id)).reverse();
  }

  // layer groups that the user has activated
  @computed get activeVisibleLayerGroups() {
    const layers = this.activeLayerGroups.filter((layer_group) => layer_group.is_visible);

    if( this.layer_group_order.length && this.layer_group_order.length === layers.length ) {
      layers.sort((a,b) => {
        if(this.layer_group_order.indexOf(a.id) > this.layer_group_order.indexOf(b.id)) {
          return true;
        }else {
          return false;
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
    return this.layer_groups.values();
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
      layers_store.all_layer_groups.set(layer.id, layer);
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
