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
    const label_prefix = this.props.layerGroup.is_active ? "Deselect" : "Select";

    return <div className={`layer ${(this.props.layerGroup.is_active) ? "layer is-selected" : ""}`}>
      <Link to={`/map/layers/${this.props.layerGroup.slug}`}>
          {this.props.layerGroup.image &&
          <div className="image" style={{'background': '#383838 url(' + this.props.layerGroup.image.card + ') center/cover'}}>
          </div>
          }
        <h2>{this.props.layerGroup.name}</h2>
        <div className="description">
          {/*Parser(this.props.layerGroup.description||"")*/}
          {/*this.props.layerGroup.credit && (<span className="credit">{Parser(this.props.layerGroup.credit)}</span>)*/}
          <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p><span className="credit"><p><em>Digital version courtesy of the Historic Towns Trust.</em></p></span>
        </div>

        {/*<div className="actions">
          <button className="button">{label_prefix} this layer</button>
        </div>*/}
      </Link>
    </div>
  }
}
