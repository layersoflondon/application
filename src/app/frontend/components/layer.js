import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';

@observer export default class Layer extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    event.preventDefault();

    this.props.layersStore.toggleLayer(this.props.layer.id);
    this.props.layer.is_active = !this.props.layer.is_active;
  }

  render() {
    let button_class = "";
    if(this.props.layer.is_active) {
      button_class = "is-selected";
    }

    return <div className="layer">
      <a href="" onClick={this.handleOnClick.bind(this)}>
        <div className="image">
        </div>
        <h2>{this.props.layer.title}</h2>
        {Parser(this.props.layer.description)}

        <button className={button_class}>
          <span>Select</span>
        </button>
      </a>
    </div>
  }
}
