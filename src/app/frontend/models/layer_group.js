import {observable, computed} from 'mobx';
import LayerModel from './layer';

export default class LayerGroupModel {
  id = null;
  name = '';
  description = '';
  slug = '';
  enabled = false;

  @observable is_active = false;
  @observable is_open = false;

  @computed get activeLayers() {
    return this.layers.filter((layer) => layer.is_active);
  }

  toggleIsOpen(){
    this.is_open = !this.is_open;
  }

  static fromJS(object) {
    let layer = new LayerGroupModel();

    layer.id = object.id;
    layer.name = object.name;
    layer.description = object.description;
    layer.slug = object.slug;
    layer.enabled = object.enabled;
    layer.image = object.image;

    layer.layers = object.layers.map((layer_data) => new LayerModel.fromJS(layer_data));

    return layer;
  }
}
