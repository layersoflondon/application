import React,{Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@observer export default class LayerTool extends Component {
  render() {
    return <div className="layer-component">
      <span className="key-symbol key-symbol--outline key-symbol--red"></span>
      <span className="name">{this.props.layer.title}</span>
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
