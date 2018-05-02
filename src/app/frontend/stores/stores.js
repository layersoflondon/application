import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import RecordStore from './record_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';
import RecordFormStore from './record_form_store';
import CardStore from './card_store';

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
  const trayViewStore = TrayViewStore.fromJS(state.trayViewStore);

  // now we have somewhere we can store cards, add our collections and records
  // and set the treeViewStore's cardStore to this initial instance of a card store...

  // const cardStore = CardStore.fromJS(state.cardStore);
  // cardStore.addCollections(collectionStore);
  // cardStore.addRecords(recordStore);
  // trayViewStore.cardStore = cardStore;

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
