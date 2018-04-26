import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';

class LayerTool extends Component {
  render() {
    return <div className="layer">
      <span className="dragger"></span>
      <span className="name">{this.props.layer.title}</span>
      <span className="slider"><span className="handle"></span></span>
    </div>
  }
}

@observer export default class LayerTools extends Component {
  constructor(props) {
    super(props);

    this.state = {is_open: false}
  }

  handleOnClick(event) {
    this.setState({is_open: !this.state.is_open});
  }

  render() {
    let classes = "m-layer-tools";
    if( !this.state.is_open ) {
      classes += " is-closed";
    }

    return <div className={classes}>
      <button onClick={this.handleOnClick.bind(this)}>Layer tools</button>

      <div className="panel">
        <h1>Layer tools</h1>
        <button onClick={this.handleOnClick.bind(this)}><span className="close"></span></button>

        {this.props.layersStore.activeLayers.map((l) => <LayerTool key={l.id} layer={l} {...this.props} />)}
      </div>
    </div>
  }
}
