import React,{Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@observer export default class LayerTool extends Component {
  handleLoopToolClick(event) {
    event.preventDefault();

    if( this.props.layersStore.loop_layer_id === this.props.layer.id ) {
      this.props.layersStore.loop_layer_id = null;
    }else {
      this.props.layersStore.loop_layer_id = this.props.layer.id;
    }
  }

  toggleLoopTool() {
    if( this.props.index === 0 ) return false;

    const options = {};

    if( this.props.layersStore.loop_layer_id === this.props.layer.id ) {
      options.label = "Off";
    }else {
      options.label = "Loop";
    }

    return options;
  }

  render() {
    return <div className="layer">
      <span className="name">{this.props.layer.title}</span>

      {this.toggleLoopTool() && <span onClick={this.handleLoopToolClick.bind(this)}>{this.toggleLoopTool().label}</span>}
      <span className="slider">
        <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layer.opacity} onChange={(value) => this.props.layer.opacity = value} />
      </span>
    </div>
  }
}
