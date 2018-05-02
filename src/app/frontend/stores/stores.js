import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import RecordStore from './record_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';
import RecordFormStore from './record_form_store';
import CardStore from './card_store';

export default (state) => {
  const recordFormStore = RecordFormStore.fromJS(state.recordFormStore);
  const mapViewStore = MapViewStore.fromJS(state.mapViewStore);
  const layersStore = LayersStore.fromJS(state.layersStore);

  const collectionStore = CollectionStore.fromJS(state.collectionStore);
  const recordStore = RecordStore.fromJS(state.recordStore);
  const trayViewStore = TrayViewStore.fromJS(state.trayViewStore);
  const cardStore = CardStore.fromJS(state.cardStore);

  cardStore.addCollections(collectionStore);
  cardStore.addRecords(recordStore);
  trayViewStore.cardStore = cardStore;

  console.log("collectionStore: ", collectionStore);

  return {
    recordFormStore: recordFormStore,
    trayViewStore: trayViewStore,
    mapViewStore: mapViewStore,
    layersStore: layersStore,
    collectionStore: collectionStore,
    recordStore: recordStore
  }
}
