import CardStore from './card_store';
import MapViewStore from './map_view_store';
import TrayViewStore from './tray_view_store';
import RecordStore from './record_store';
import CollectionStore from './collection_store';
import LayersStore from './layers_store';

export default (state) => ({
  CardStore: new CardStore(state.cardStore),
  MapViewStore: new MapViewStore(state.mapViewStore),
  TrayViewStore: new TrayViewStore(state.trayViewStore),
  RecordStore: new RecordStore(state.recordStore),
  CollectionStore: new CollectionStore(state.collectionStore),
  LayersStore: new LayersStore(state.layersStore)
});
