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
    let classes = 'layer';
    if(this.props.layerGroup.is_open) classes += ' is-open';
    if(this.props.layerGroup.layers.length>0) classes += ' has-components';

    return (
      <div className={classes}>
        <span className="name" onClick={()=>this.props.layerGroup.toggleIsOpen()}>{this.props.layerGroup.name}</span>
        <div className="view-controls">
          <span className="show-hide">
          </span>
          <span className="slider">
            <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layerGroup.opacity} onChange={(value) => this.props.layerGroup.opacity = value} />
          </span>
        </div>

        <div className="layer-components">
          {this.props.layerGroup.layers.map((layer) => <LayerTool key={layer.id} layer={layer} />)}
        </div>
      </div>
    );
  }
}
