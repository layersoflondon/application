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
  enabled = false;
  layer_group = null;

  @observable opacity = 1;
  @observable parent_opacity = null;
  @observable is_visible = true;
  @observable is_loading = false;
  @observable highlightedFeature = null;

  @computed get getOpacity() {
    if( typeof(this.parent_opacity)==="number" && this.parent_opacity < this.opacity ) {
      return this.parent_opacity;
    }else {
      return this.opacity;
    }
  }

  toggleVisibility() {
    this.is_visible = !this.is_visible;

    if(this.is_visible ) {
      this.opacity = 1;
    }else {
      this.opacity = 0;
    }

    return this.is_visible;
  }

  handleClicked() {
    if( this.layer_type === 'collection' ) {
      this.is_visible = !this.is_visible;
    }
  }

  static fromJS(object, layer_group) {
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
    layer.data = object.data;
    layer.enabled = object.enabled;
    layer.layer_group = layer_group;

    return layer;
  }
}
