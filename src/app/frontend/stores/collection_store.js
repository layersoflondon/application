import {observable} from "mobx";

export default class CollectionsStore {
  @observable collections = [{id: 1, name: "a collection"}];
}
