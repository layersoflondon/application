import {observable} from 'mobx';

export default class LayerModel {
  id = null;
  title = '';
  description = '';
  date = null;
  url = '';
  attribution = '';
  enabled =  true;

  @observable opacity = 0;
  @observable is_active = false;

  static fromJS(object) {
    let layer = new LayerModel();

    layer.id = object.id;
    layer.title = object.title;
    layer.description = object.description;
    layer.date = object.date;
    layer.opacity = object.opacity;
    layer.url = object.url;
    layer.attribution = object.attribution;
    layer.enabled = object.enabled;

    return layer;
  }
}
