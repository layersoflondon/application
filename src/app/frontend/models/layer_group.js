import {observable, computed, observe} from 'mobx';
import LayerModel from './layer';

export default class LayerGroupModel {
  id = null;
  name = '';
  short_name = '';
  description = '';
  slug = '';
  enabled = false;
  highlighted = false;

  @observable opacity = 1;
  @observable is_active = false;
  @observable is_open = true;
  @observable is_visible = true;
  @observable layers = [];

  constructor() {
    observe( this, 'opacity', (change) => {
      this.visibleLayers.map((layer) => layer.parent_opacity = change.newValue);
    });
  }

  @computed get visibleLayers() {
    let layers = this.layers.filter((layer) => layer.is_visible);
    let tileserverLayers = layers.filter((l)=>l.layer_type === 'tileserver');
    let otherLayers = layers.filter((l) => l.layer_type !== 'tileserver');
    layers = [].concat(otherLayers, tileserverLayers);

    return layers;
  }

  @computed get allLayers() {
    let layers = this.layers;
    let tileserverLayers = layers.filter((l)=>l.layer_type === 'tileserver');
    let otherLayers = layers.filter((l) => l.layer_type !== 'tileserver');
    layers = [].concat(otherLayers, tileserverLayers);

    return layers;
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
    layer.short_name = object.short_name;
    layer.description = object.description;
    layer.slug = object.slug;
    layer.enabled = object.enabled;
    layer.image = object.image;
    layer.highlighted = object.highlighted;

    layer.layers = object.layers.map((layer_data) => new LayerModel.fromJS(layer_data, layer));

    return layer;
  }
}
