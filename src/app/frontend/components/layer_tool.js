import React,{Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

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

  render() {
    return <div className="layer-component">
      <span className={`key-symbol key-symbol--outline ${this.layerSymbolClassName(this.props.layer)}`}></span>
      <span className="name">{this.props.layer.name}</span>
      <div className="view-controls">
        <span className="show-hide">
        </span>
        <span className="slider">
          <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layer.opacity} onChange={(value) => this.props.layer.opacity = value} />
        </span>
      </div>
    </div>;
  }
}
