import React,{Component} from 'react';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';
import {Link} from "react-router-dom";

@observer export default class LayerGroup extends Component {
  constructor(props) {
    super(props);
    this.creditLinkRef = React.createRef();
  }

  render() {
    return <div className={`layer ${(this.props.layerGroup.is_active) ? "layer is-selected" : ""}`}>
      <Link to={`/map/layers/${this.props.layerGroup.slug}`}>
          {this.props.layerGroup.image &&
          <div className="image" style={{'backgroundImage': 'url(' + this.props.layerGroup.image.card + ')'}}>
          </div>
          }
        <h2>{this.props.layerGroup.short_name}</h2>
        <div className="description">
          {Parser(this.props.layerGroup.description||"")}
          {this.props.layerGroup.credit && (<span className="credit">{Parser(this.props.layerGroup.credit)}</span>)}
        </div>

        <div className="actions">
          <button className="button">More Details</button>
        </div>
      </Link>
    </div>
  }
}
