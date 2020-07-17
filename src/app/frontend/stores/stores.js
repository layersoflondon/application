import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';
import RecordFormStore from './record_form_store';
import CollectionFormStore from './collection_form_store';
import TagGroupsStore from './tag_groups_store';

/**
 * given a state object, instantiate our stores using the json rendered into the page
 *
 * @param state
 * @returns {{recordFormStore, trayViewStore, mapViewStore, layersStore, collectionStore, recordStore}}
 */
export default (state) => {

  let {tray, collections, layer_categories, map, layers} = state;

  const recordFormStore = RecordFormStore.fromJS({});
  const collectionFormStore = new CollectionFormStore.fromJS({});
  const mapViewStore = MapViewStore.fromJS(map);
  const layersStore = new LayersStore.fromJS(layers);
  const trayViewStore = TrayViewStore.fromJS(tray);
  const collectionStore = CollectionStore.fromJS(collections, trayViewStore);
  const tagGroupsStore = new TagGroupsStore();

  layersStore.categories = layer_categories;

  mapViewStore.trayViewStore = trayViewStore;

  const stores = {
    recordFormStore: recordFormStore,
    trayViewStore: trayViewStore,
    mapViewStore: mapViewStore,
    layersStore: layersStore,
    collectionStore: collectionStore,
    collectionFormStore: collectionFormStore,
    tagGroupsStore: tagGroupsStore
  };

  window.stores = stores;

  return stores;
}
