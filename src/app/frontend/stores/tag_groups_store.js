import {observable} from 'mobx';
import axios from 'axios';

export default class TagGroupsStore {
  @observable tag_groups = observable.map();

  constructor() {
    axios.get('/tag_groups').then((response) => {
      const groups = observable.map();

      response.data.map((result) => groups.set(result.id, result));
      this.tag_groups.replace(groups);
    });
  }
}
