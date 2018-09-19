import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';

@observer export default class Layer extends Component {
  constructor(props) {
    super(props);
    this.creditLinkRef = React.createRef();
  }

  handleOnClick(event) {
    event.preventDefault();

    this.props.layersStore.toggleLayer(this.props.layer.id);
    this.props.layer.is_active = !this.props.layer.is_active;
  }

  render() {

    return <div className={`layer ${(this.props.layer.is_active) ? "layer is-selected" : ""}`}>
      <a>
          {this.props.layer.image &&
          <div className="image" style={{'backgroundImage': 'url(' + this.props.layer.image.card + ')'}}>
          </div>
          }
        <h2>{this.props.layer.title}</h2>
        <div className="description">{Parser(this.props.layer.description)}</div>
        {this.props.layer.credit && (<span className="credit">{Parser(this.props.layer.credit)}</span>)}

        <button onClick={this.handleOnClick.bind(this)}>
          <span>Select this layer</span>
        </button>
      </a>
    </div>
  }
}
