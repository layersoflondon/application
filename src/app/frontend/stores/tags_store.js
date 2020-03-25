import {action, computed, observable, runInAction} from 'mobx';

export default class TagsStore {
  @observable _tag_ids = [];

  tags = [];
  name = "";

  constructor(group) {
    this.id = group.id;
    this.name = group.name;
    this.tags = group.tags;
  }

  @computed get tag_ids() {
    return this._tag_ids;
  }set tag_ids(ids) {
    this._tag_ids = ids;
  }

  @computed get checkedTagIds() {
    return this.tag_ids.map((id) => id).map((id) => parseInt(id, 10)).sort();
  }set checkedTagIds(ids) {
    this._tag_ids = ids.map((id) => parseInt(id, 10));
  }

  @computed get checkedTagCount() {
    return this.checkedTagIds.length;
  }

  @computed get allTagIds() {
    const ids = this.tags.map((tag) => tag.id).map((id) => parseFloat(id, 10)).sort();
    return ids;
  }

  @computed get allTagsChecked() {
    return this.checkedTagIds.join(',') === this.allTagIds.join(',');
  }

  @action.bound toggleTag(id) {
    const tagId = parseInt(id, 10);
    let ids = this._tag_ids.slice();

    ids = ids.filter((_id, index, self) => self.indexOf(_id) === index); // build uniq array of ids
    const id_index = ids.indexOf(tagId);

    if(id_index>-1) {
      ids.splice(id_index, 1);
    }else {
      ids.push(tagId);
    }

    runInAction(() => {
      this.checkedTagIds = ids;
    });
  }

  @action.bound tagIsChecked(id) {
    return this.checkedTagIds.indexOf(id)>-1;
  }

  @action.bound selectAll() {
    runInAction(() => {
      this.checkedTagIds = this.allTagIds;
    });
  }

  @action.bound clearAll() {
    runInAction(() => {
      this.checkedTagIds = [];
    });
  }
}
