import React,{Component} from 'react';
import {observer} from 'mobx-react';
import Slider from 'rc-slider';

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@observer export default class LayerTool extends Component {
  render() {
    return <div className="layer">
      <span className="name">{this.props.layer.title}</span>
      <span className="slider">
        <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layer.opacity} onChange={(value) => this.props.layer.opacity = value} />
      </span>
    </div>
  }
}

