import {observable, computed, observe} from 'mobx';
import LayerModel from './layer';

export default class LayerGroupModel {
  id = null;
  name = '';
  description = '';
  slug = '';
  enabled = false;

  @observable opacity = 1;
  @observable is_active = false;
  @observable is_open = false;
  @observable is_visible = true;
  @observable layers = [];

  constructor() {
    observe( this, 'opacity', (change) => {
      this.visibleLayers.map((layer) => layer.parent_opacity = change.newValue);
    });
  }

  @computed get visibleLayers() {
    return this.layers.filter((layer) => layer.is_visible);
  }

  toggleIsOpen(){
    this.is_open = !this.is_open;
  }

  toggleVisibility() {
    this.is_visible = !this.is_visible;
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
