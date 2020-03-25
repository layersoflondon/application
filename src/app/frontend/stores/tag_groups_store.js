import {action, computed, observable} from 'mobx';
import axios from 'axios';
import TagsStore from './tags_store';

export default class TagGroupsStore {
  @observable tag_groups = observable.map();

  constructor() {
    axios.get('/tag_groups').then((response) => {
      const groups = observable.map();

      response.data.map((result) => {
        const tagsStore = new TagsStore(result);
        groups.set(result.id, tagsStore);
      });

      this.tag_groups.replace(groups);
    });
  }

  @computed get totalCheckedCount() {
    let count = 0;
    this.tag_groups.values().map((group) => count += group.checkedTagCount);
    return count;
  }

  @computed get checkedTagIds() {
    const all_ids = [];
    this.tag_groups.values().map((group) => {
      group.checkedTagIds.map((id) => all_ids.push(id));
    });

    return all_ids;
  }

  @action.bound uncheckTagsInAllGroups() {
    this.tag_groups.values().map((group) => group.clearAll());
  }
}
