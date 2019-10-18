import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';
import RecordFormStore from './record_form_store';
import CollectionFormStore from './collection_form_store'

/**
 * given a state object, instantiate our stores using the json rendered into the page
 *
 * @param state
 * @returns {{recordFormStore, trayViewStore, mapViewStore, layersStore, collectionStore, recordStore}}
 */
export default (state) => {
  const {tray, collections, layer_groups, map} = state.data;
  // console.log("Got state: ", state, tray, collections, layers, map);

  const recordFormStore = RecordFormStore.fromJS({});
  const collectionFormStore = new CollectionFormStore.fromJS({});
  const mapViewStore = MapViewStore.fromJS(map);
  const layersStore = LayersStore.fromJS(layer_groups);
  console.log(tray);
  const trayViewStore = TrayViewStore.fromJS(tray);
  const collectionStore = CollectionStore.fromJS(collections, trayViewStore);

  mapViewStore.trayViewStore = trayViewStore;

  const stores = {
    recordFormStore: recordFormStore,
    trayViewStore: trayViewStore,
    mapViewStore: mapViewStore,
    layersStore: layersStore,
    collectionStore: collectionStore,
    collectionFormStore: collectionFormStore
  };

  window.stores = stores;

  return stores;
}
