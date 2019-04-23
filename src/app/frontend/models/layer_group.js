import {observable} from 'mobx';

export default class LayerGroupModel {
  id = null;
  name = '';
  description = '';
  slug = '';
  // credit = '';
  // date = null;
  // url = '';
  // attribution = '';
  enabled = false;

  // @observable opacity = 0;
  @observable is_active = false;

  static fromJS(object) {
    let layer = new LayerGroupModel();

    layer.id = object.id;
    layer.name = object.name;
    layer.description = object.description;
    layer.slug = object.slug;
    // layer.credit = object.credit;
    // layer.date = object.date;
    // layer.opacity = object.opacity;
    // layer.url = object.url;
    // layer.attribution = object.attribution;
    layer.enabled = object.enabled;
    layer.image = object.image;

    return layer;
  }
}
