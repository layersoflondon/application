import {observable} from 'mobx';

export default class LayerModel {
  id = null;
  title = '';
  description = '';
  credit = '';
  date = null;
  url = '';
  attribution = '';
  enabled = false;

  @observable opacity = 0;
  @observable is_active = false;

  static fromJS(object) {
    let layer = new LayerModel();

    layer.id = object.id;
    layer.title = object.title;
    layer.description = object.description;
    layer.credit = object.credit;
    layer.date = object.date;
    layer.opacity = object.opacity;
    layer.url = object.url;
    // layer.attribution = object.attribution;
    layer.enabled = object.enabled;
    layer.image = object.image;

    return layer;
  }
}
