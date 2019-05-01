import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@inject('trayViewStore')
@observer export default class LayerTool extends Component {
  layerSymbolClassName(layer) {
    let className="";
    switch(layer.layer_type) {
      case 'tileserver':
        className="key-symbol--red";
        break;
      default:
        className="";
    }

    return className;
  }

  toggleLayerVisibility(event) {
    event.preventDefault();

    this.props.layer.toggleVisibility();
  }

  showCollectionInTray() {
    this.props.trayViewStore.collection_id = this.props.layer.collection_id;
  }

  handleLayerClick() {
    this.props.layer.handleClicked()
  }

  render() {
    const layer_visibility = this.props.layer.is_visible ? 'is-visible' : 'is-hidden';

    return <div className="layer-component">
      <span className={`key-symbol key-symbol--outline ${this.layerSymbolClassName(this.props.layer)}`}></span>
      <span className="name" onClick={this.handleLayerClick.bind(this)}>{this.props.layer.name} {this.props.layer.is_loading && <span className="is-loading"></span>}</span>
      <div className="view-controls">
        {this.props.layer.collection_id && (
            <span className="show-hide collection" onClick={this.showCollectionInTray.bind(this)}>
            </span>
        )}
        <span className={`show-hide ${layer_visibility}`} onClick={this.toggleLayerVisibility.bind(this)}>
        </span>
        <span className="slider">
          <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layer.opacity} onChange={(value) => this.props.layer.opacity = value} />
        </span>
      </div>
    </div>;
  }
}
