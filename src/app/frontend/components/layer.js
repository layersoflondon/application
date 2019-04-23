import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';
import {recordEvent} from "../config/data_layer";
import {Link} from "react-router-dom";

@observer export default class Layer extends Component {
  constructor(props) {
    super(props);
    this.creditLinkRef = React.createRef();
  }

  handleOnClick(event) {
    event.preventDefault();

    this.props.layersStore.toggleLayer(this.props.layer.id);
    this.props.layer.is_active = !this.props.layer.is_active;

    recordEvent('layerSelected', {
      'layerSelected': this.props.layersStore.active_layers.values().map((layer) => layer.title).join(" | ")
    })


  }

  render() {
    console.log(this.props.layer)
    return <div className={`layer ${(this.props.layer.is_active) ? "layer is-selected" : ""}`}>
      <Link to={`/map/layers/${this.props.layer.slug}`}>
          {this.props.layer.image &&
          <div className="image" style={{'backgroundImage': 'url(' + this.props.layer.image.card + ')'}}>
          </div>
          }
        <h2>{this.props.layer.name}</h2>
        <div className="description">
          {Parser(this.props.layer.description||"")}
          {this.props.layer.credit && (<span className="credit">{Parser(this.props.layer.credit)}</span>)}
        </div>


        <button onClick={this.handleOnClick.bind(this)}>
          <span>Select this layer</span>
        </button>
      </Link>
    </div>
  }
}
