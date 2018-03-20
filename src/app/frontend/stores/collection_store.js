import observable from 'mobx';

export class CollectionsStore {
  @observable collections = [{id: 1, name: "a collection"}];
}

const collectionStore = window.collectionsStore = new CollectionsStore;
export default collectionStore;
