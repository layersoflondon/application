import React,{Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'rc-slider';
import LayerTool from './layer_tool';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@observer export default class LayerGroupTool extends Component {
  handleLoupeToolClick(event) {
    event.preventDefault();

    if( this.props.layersStore.loupe_layer_id === this.props.layer.id ) {
      this.props.layersStore.loupe_layer_id = null;
    }else {
      this.props.layersStore.loupe_layer_id = this.props.layer.id;
    }
  }

  toggleLoupeTool() {
    if( this.props.index === 0 ) return false;

    const options = {};

    if( this.props.layersStore.loupe_layer_id === this.props.layer.id ) {
      options.label = "Off";
    }else {
      options.label = "Loupe";
    }

    return options;
  }

  render() {
    return <div className="layer">
      <span className="name">{this.props.layerGroup.name}</span>

      <span className="slider">
        <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layerGroup.opacity} onChange={(value) => this.props.layerGroup.opacity = value} />
      </span>

      <div className="layers">
        {this.props.layerGroup.layers.map((layer) => <LayerTool key={layer.id} layer={layer} />)}
      </div>
    </div>
  }
}
