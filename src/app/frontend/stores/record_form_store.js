import {observable, computed} from 'mobx';

/**
 * Build a new Record instance
 */
export default class RecordFormStore {
  id = null;
  title = '';
  description = '';
  date_from = '';
  date_to = '';
  links = [];
  collection_id = null;
  team_id = null;
  collection_type_id = null;

  @observable media = [];

  @observable visible_pane = null; // which accordion pane is visible
  @observable current_media_item_index = this.media.length>0 ? 0 : null; //which media item is active (being edited)
  @observable primary_media_item = null;

  @computed get current_media_item() {
    if( typeof this.current_media_item_index === "number" ) {
      return this.media[this.current_media_item_index];
    }
  }
}
