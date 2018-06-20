import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';
import RecordFormStore from './record_form_store';

/**
 * given a state object, instantiate our stores using the json rendered into the page
 *
 * @param state
 * @returns {{recordFormStore, trayViewStore, mapViewStore, layersStore, collectionStore, recordStore}}
 */
export default (state) => {
  const recordFormStore = RecordFormStore.fromJS(state.recordFormStore);
  const mapViewStore = MapViewStore.fromJS(state.mapViewStore);
  const layersStore = LayersStore.fromJS(state.layersStore);

  const collectionStore = CollectionStore.fromJS(state.collectionStore);

  const {title, description, cards} = state.data;
  const trayViewStore = TrayViewStore.fromJS(cards, title, description);

  const stores = {
    recordFormStore: recordFormStore,
    trayViewStore: trayViewStore,
    mapViewStore: mapViewStore,
    layersStore: layersStore,
    collectionStore: collectionStore
  };

  window.stores = stores;

  return stores;
}
