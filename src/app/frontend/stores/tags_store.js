import {action, computed, observable, runInAction} from 'mobx';

export default class TagsStore {
  @observable _tag_ids = [];

  tags = [];
  name = "";

  constructor(group) {
    this.name = group.name;
    this.tags = group.tags;
  }

  @computed get tag_ids() {
    return this._tag_ids;
  }set tag_ids(ids) {
    this._tag_ids = ids;
  }

  @computed get checkedTagIds() {
    return this.tag_ids.map((id) => id).map((id) => parseFloat(id, 10)).sort();
  }set checkedTagIds(ids) {
    this._tag_ids = ids;
  }

  @computed get checkedTagCount() {
    return this.checkedTagIds.length;
  }

  @computed get allTagIds() {
    const ids = this.tags.map((tag) => tag.id).map((id) => parseFloat(id, 10)).sort();
    return ids;
  }

  @computed get allTagsChecked() {
    console.log(this.checkedTagIds, this.allTagIds);
    return this.checkedTagIds === this.allTagIds;
  }

  @action.bound toggleTag(id) {
    const ids = this._tag_ids.slice();
    ids.push(id);
  }

  @action.bound tagIsChecked(id) {
    return this.checkedTagIds.indexOf(id)>-1;
  }

  @action.bound selectAll() {
    runInAction(() => {
      console.log(this.tag_ids, this.allTagIds);
      this._tag_ids = this.allTagIds;
    });
  }

  @action.bound clearAll() {
    this._tag_ids = [];
  }
}
