import {observable, computed} from 'mobx';

export default class RecordFormStore {
  title = '';
  description = '';
  date_from = '';
  date_to = '';
  links = [];
  collection_id = null;
  team_id = null;

  @observable media = [];

  @observable visible_pane = null; // which accordion pane is visible
  @observable current_media_item_index = this.media.length>0 ? 0 : null; //which media item is active (being edited)
  @observable primary_media_item = null;

  @observable collection_type_id; // whether this is being added to a user's own collection or a public one
  @observable collection_id; // array of chosen collections
  @observable team_id; // array of availble teams

  @computed get current_media_item() {
    if( typeof this.current_media_item_index === "number" ) {
      return this.media[this.current_media_item_index];
    }
  }
}
