import {observable} from 'mobx';

export default class RecordFormStore {
  title = '';
  description = '';
  date_from = '';
  date_to = '';
  media = [];
  links = [];
  collection_id = null;
  team_id = null;

  @observable visible_pane = null; // which accordian pane is visible
  @observable current_media_item = null; //which media item is active (being edited)

  @observable collections; // array of available collections
  @observable teams; // array of availble teams
}
