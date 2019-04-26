import {observable, computed} from 'mobx';

export default class LayerModel {
  id = null;
  title = '';
  name = '';
  description = '';
  credit = '';
  date_from = null;
  date_to = null;
  layer_type = '';
  layer_type_name = '';
  layer_data = '';
  collection_id = null;
  enabled = false;

  @observable opacity = 1;
  @observable parent_opacity = null;
  @observable is_active = true;

  @computed get getOpacity() {
    if( typeof(this.parent_opacity)==="number" && this.parent_opacity < this.opacity ) {
      return this.parent_opacity;
    }else {
      return this.opacity;
    }
  }

  static fromJS(object) {
    let layer = new LayerModel();

    layer.id = object.id;
    layer.title = object.title;
    layer.name = object.name;
    layer.description = object.description;
    layer.credit = object.credit;
    layer.date_from = object.date_from;
    layer.date_to = object.date_to;
    layer.layer_type = object.layer_type;
    layer.layer_type_name = object.layer_type_name;
    layer.layer_data = object.layer_data;
    layer.collection_id = object.collection_id;
    layer.enabled = object.enabled;

    return layer;
  }
}
