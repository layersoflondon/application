import {action, observable, observe, computed, intercept, runInAction} from 'mobx';
import Record from '../sources/record';
import Search from '../sources/search';

import Collection from '../sources/collection';

import CardModel from '../models/card';
import pluralize from 'pluralize'

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  @observable root = true;
  @observable locked = false;
  @observable loading = false;
  
  @observable tray_is_visible = true;

  @observable cards = observable.map();
  @observable collection_store = null;

  @observable title = null;
  @observable description = null;

  @observable record = null; //the record we're viewing or editing
  @observable collection = null; //the collection we're viewing
  @observable fetch_additional_records = false; // when set to true, some observers (like record_id) will fetch data associated with the current record

  @observable loading_record = false;
  @observable loading_collection = false;
  @observable loading_team = false;
  @observable loading_user = false;
  @observable record_id = null;
  @observable collection_id = null;
  @observable collection_ids = null;
  @observable user_id = null;
  @observable team_id = null;
  @observable searching = false;
  @observable loading_error = false;

  @observable results

  @observable highlightedResults = observable.map();
  @observable mainResults = observable.map();
  @observable show_highlighted_results = false;

  previousPath = null;
  mapRef = null;
  tray_list_ref = null;

  constructor() {
    observe(this, 'tray_is_visible', (change) => {
      if(!this.mapRef) return change;
      const size = this.mapRef.leafletElement.getSize();

      const sizeChanged = () => {
        const newSize = this.mapRef.leafletElement.getSize();
        const changed = Object.values(size).join(',') !== Object.values(newSize).join(',');
        return changed;
      };

      const resize = () => {
        this.mapRef.leafletElement.invalidateSize();
      };

      const resizeTimeout = setInterval(() => {
        resize();

        if(sizeChanged()) {
          clearTimeout(resizeTimeout);
        }

      }, 500);

      return change;
    });

    intercept(this, "collection_ids", (change) => {
      if( change.newValue && change.newValue.length ) {
        let collection_ids = this.collection_ids || [];
        collection_ids = [].concat(...collection_ids, change.newValue);
        change.newValue = collection_ids;
      }

      return change;
    });

    observe(this, 'collection_ids', (change) => {
      this.loading_error = false;
      if( change.newValue ) {
        if( !this.collection_ids.toJS().length ) return;
        this.loading_collection = true;

        Collection.query({key: 'id', value: this.collection_ids.toJS()}).then((response) => {
          this.root = true;

          let records = response.data.map((data) => data.records);
          records = [].concat(...records);
          const title = `Showing ${records.length} ${pluralize('record', records.length)}`;

          this.setHeaderContent({
            title: title,
            introduction: "",
            tray_view_type: "Collection"
          });
          this.showCollectionOfCards(records);
          //  Lock this view so dragging the map doesn't change the cards
          this.locked = true;
        }).catch((error) => {
          this.loading_error = true;
          this.collection_id = null;
        }).then(() => {
          this.loading_collection = false;
        });
      }else {
        this.collection_id = null;
        this.loading_collection = false;
        this.locked = false;
        this.root = true;
        this.restoreRootState();
      }
    });
  }

  @action.bound toggleTrayVisibility(event) {
    this.tray_is_visible = !this.tray_is_visible;
  }

  @action.bound setTrayVisibility(value) {
    this.tray_is_visible = value;
  }

  reloadTrayData() {
    this.loading = true;
    
    Search.perform({q: ""}).then((response) => {
      this.showCollectionOfCards(response.data);
    }).then(() => {
      this.loading = false;
    });
  }

  @computed get collectionsCount() {
    return this.mainResults.values().map((c) => { return c.is_collection ? 1 : 0}).reduce((a,b) => {return a + b}, 0)
  }

  @computed get recordsCount() {
    return this.mainResults.size - this.collectionsCount;
  }

  @computed get trayViewType() {
    // 5 states for the tray view:
    // - root
    // - collection: collection name, number of records, owner, description
    // - team: team name, number of records, team description, link to request joining
    // - creator: creator name, profile image url, number of records, description of person
    // - search: search query as title, or date range if no search query
  }

  @computed get mapBounds() {
    let center = this.mapRef.leafletElement.getBounds().getCenter();
    let radius = this.mapRef.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;
    const north_west = this.mapRef.leafletElement.getBounds().getNorthWest();
    const south_east = this.mapRef.leafletElement.getBounds().getSouthEast();

    const bounds = {
      top_left: north_west,
      bottom_right: south_east,
      center: center,
      radius: radius
    };

    return bounds;
  }

  /**
   *
   * @param id
   */
  removeLayerGroupCollectionId(id) {
    let collection_ids = this.collection_ids.filter((id) => id !== id);
    this.collection_ids = collection_ids;
  }

  /**
   *
   * @param id
   * @param record_id
   */
  fetchCollectionAndRecord(id, record_id) {
    this.fetch_additional_records = false;
    this.collection_id = id;
    this.record_id = record_id;
  }

  /**
   *
   * @param id
   * @param fetch_additional_records
   */
  fetchRecord(id) {
    this.record_id = id;
  }

  /**
   * replace the current collection of cards with the given data
   *
   * @param card_data
   * @param title
   * @param description
   */
  showCollectionOfCards(card_data) {
    let cards = observable.map();
    card_data.map((data) => {
      const card = CardModel.fromJS(data, this);
      cards.set(card.id, card);
    });

    if( this.tray_list_ref.current && this.mainResults.keys().toString() !== cards.keys().toString() ) {
      this.tray_list_ref.current.scrollTop = 0;
    }

    this.loading = false;
    this.mainResults.replace(cards);
  }

  /**
   * rather than replace the existing set of cards, append these onto it
   * @param card_data
   */
  updateCollectionOfCards(card_data) {
    const items = observable.map();

    card_data.map((data) => {
      const card = CardModel.fromJS(data, this);
      items.set(card.id, card);
    });
    
    this.mainResults.merge(items);
  }

  /**
   * build a new TrayViewStore instance from the given data
   *
   * @param tray_data
   * @returns {TrayViewStore}
   */
  static fromJS(tray_data) {
    let store = new TrayViewStore();

    store.title = tray_data.title;
    store.description = tray_data.description;

    tray_data.cards.map((data) => {
      const card = CardModel.fromJS(data, store);
      store.mainResults.set(card.id, card);
    });

    return store;
  }

  /**
   * Once a record has been persisted, push its updated version onto the cards store
   * @param data
   * @returns {*}
   */
  addOrUpdateRecord(data) {
    const card = CardModel.fromJS(data, this);
    this.mainResults.set(card.id, card);

    return card;
  }

  // actions
  @action.bound fetchGettingStartedData() {
    this.loading = true;
    
    runInAction(async () => {
      const highlightedContentData = await Search.perform({type: 'highlighted', limit: 2});
      const popularContentData     = await Search.perform({type: 'popular', limit: 10});
      
      const highlightedContent = observable.map();
      const popularContent = observable.map();

      highlightedContentData.data.map((result) => {
        const card = CardModel.fromJS(result, this);
        highlightedContent.set(card.id, card);
      });

      popularContentData.data.map((result) => {
        const card = CardModel.fromJS(result, this);
        popularContent.set(card.id, card);
      });
      
      if(this.highlightedResults.size === 0) {
        this.highlightedResults.replace(highlightedContent);
      }

      this.mainResults.replace(popularContent);

      this.loading = false;
    });
  }

  /**
   * perform a search using just the current visible bounds of the map. this will be called
   * whenever the user drags or zooms the map in order to show relevant markers
   *
   * @param append_data
   */
  @action.bound reloadTrayDataForBounds(bounds) {
    this.fetchData({geobounding: bounds});
  }

  @action.bound fetchData(params, options = {}) {
    this.loading = true;
    
    const lockTray = options.lockTray || this.locked;

    runInAction(async() => {
      const mainContentData = await Search.perform(params);
      this.mainResults.clear();
      
      const mainResults = observable.map();
      
      mainContentData.data.map((result) => {
        const card = CardModel.fromJS(result, this);
        mainResults.set(card.id, card);
      });
      
      this.mainResults.replace(mainResults);
      this.loading = false;
      this.locked = lockTray;
    });
  }

  @action.bound fetchRecord(id) {
    Record.show(null, id).then((response) => {
      let card = CardModel.fromJS(response.data, this);
      
      if(!this.mainResults.has(card.id)){
        this.mainResults.set(card.id, card);
      }
      
      this.record = card.data;
      this.loading_record = true;
      this.loading_error = false;
    }).catch((error) => {
      console.log(error);
      this.record_id = null;
      this.loading_error = true;
    }).then(() => {
      this.loading_record = false;
    });
  }

  @action.bound fetchCollection(id) {
    this.loading = true;
    this.mainResults.clear();
    this.highlightedResults.clear();

    runInAction(async() => {
      const collection = await Collection.show(null, id);
      this.locked = true;
      this.collection = collection.data;
      
      const mainResults = observable.map();
      this.collection.records.map((result) => {
        const card = CardModel.fromJS(result, this);
        mainResults.set(result.id, card);
      });
      
      this.loading = false;
      this.mainResults.replace(mainResults);
    });
  }

  @action.bound fetchCollections() {
    this.mainResults.clear();
    this.loading = true;

    runInAction(async() => {
      const response = await Search.perform({collections: true});
      this.showCollectionOfCards(response.data);

      this.loading = false;
    });
  }

  @computed get cardsToRenderOnMap() {
    let cards = observable.map();
    
    cards.merge(this.mainResults);
    
    if(this.showHighlightedResults) {
      this.highlightedResults.values().map((result) => {
        if(cards.keys().indexOf(result.id)<0) cards.set(result.id, result);
      });
    }
    
    return cards;
  }

  @computed get trayLocked() {
    return this.locked;
  }set trayLocked(value) {
    this.locked = value;
  }

  @computed get showHighlightedResults() {
    return this.show_highlighted_results;
  }set showHighlightedResults(value) {
    this.show_highlighted_results = value;
  }

  @computed get goBackto() {
    return this.previousPath;
  }set goBackto(value) {
    console.log("Assigning goBackTo = ", value);
    this.previousPath = value;
    if(value === null) {
      this.locked = false;
    }
  }
}
