import {observable, computed} from 'mobx';

export default class LayerModel {
  id = null;
  title = '';
  description = '';
  credit = '';
  date_from = null;
  date_to = null;
  layer_type = '';
  layer_data = '';
  enabled = false;

  @observable opacity = 1;
  @observable parent_opacity = null;
  @observable is_active = true;

  @computed get getOpacity() {
    if( this.parent_opacity && this.parent_opacity < this.opacity ) {
      return this.parent_opacity;
    }else {
      return this.opacity;
    }
  }

  static fromJS(object) {
    let layer = new LayerModel();

    layer.id = object.id;
    layer.title = object.title;
    layer.description = object.description;
    layer.credit = object.credit;
    layer.date_from = object.date_from;
    layer.date_to = object.date_to;
    layer.layer_type = object.layer_type;
    layer.layer_data = object.layer_data;
    layer.enabled = object.enabled;

    return layer;
  }
}
