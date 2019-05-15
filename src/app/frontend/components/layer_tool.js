import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@inject('trayViewStore', 'layersStore')
@observer export default class LayerTool extends Component {
  constructor(props) {
    super(props);
    this.sliderRef = React.createRef();
  }

  layerSymbolColorStyle(layer) {
    let style={};

    if( layer.layer_type === 'tileserver' && layer.layer_data.vector_tiles === 'true') {
      style.color = layer.layer_data.vector_layer_colour;
    }

    if( layer.layer_type === 'geojson' ) {
      style.color = layer.layer_data.vector_layer_colour;
    }

    return style;
  }

  toggleLayerVisibility(event) {
    event.preventDefault();

    let visible = this.props.layer.toggleVisibility();

    if( this.props.layer.layer_type === 'collection' && ( this.props.trayViewStore.collection_ids &&  this.props.trayViewStore.collection_ids.length) ) {
      const cards = this.props.trayViewStore.cards.values().filter((card) => card.data.collection_ids.toJS().indexOf(parseInt(this.props.layer.layer_data.collection_id, 10)) > -1);
      cards.map((card) => card.visible = visible);
    }

    if( visible ) {
      this.sliderRef.current.setState({value: 1});
    }else {
      this.sliderRef.current.setState({value: 0});
    }
  }

  handleLayerClick() {
    this.props.layer.handleClicked()
  }

  setLayerOpacity(value) {
    this.props.layer.opacity = value;
  }

  render() {
    let layer_visibility = '';

    if( !this.props.layer.is_visible || this.props.layer.opacity === 0 ) {
      layer_visibility = 'is-hidden';
    }else {
      layer_visibility = 'is-visible';
    }

    return <div className={`layer-component ${layer_visibility}`}>
      <span className={`key-symbol key-symbol--outline`} style={this.layerSymbolColorStyle(this.props.layer)}></span>
      <span className="name" onClick={this.handleLayerClick.bind(this)}>{this.props.layer.name} {this.props.layer.is_loading && <span className="is-loading"></span>}</span>
      <div className="view-controls">
        <span className={`show-hide ${layer_visibility}`} onClick={this.toggleLayerVisibility.bind(this)}>
        </span>
        <span className="slider">
          <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layer.opacity} ref={this.sliderRef} onChange={this.setLayerOpacity.bind(this)} />
        </span>
      </div>
    </div>;
  }
}
