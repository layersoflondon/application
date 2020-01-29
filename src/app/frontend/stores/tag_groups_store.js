import {observable} from 'mobx';
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
}
