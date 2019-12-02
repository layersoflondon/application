import React,{Component} from 'react';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';
import {Link} from "react-router-dom";
import {openModalLink} from '../helpers/modals';

@observer export default class LayerGroup extends Component {
  constructor(props) {
    super(props);
    this.creditLinkRef = React.createRef();
  }

  render() {
    const layerGroupPath = (id) => {
      return openModalLink(this.props.router.location, {key: 'layer', value: id});
    }

    return <div className={`layer ${(this.props.layerGroup.is_active) ? "layer is-selected" : ""}`}>
      <Link to={layerGroupPath(this.props.layerGroup.slug)}>
          {this.props.layerGroup.image &&
          <div className="image" style={{'background': '#383838 url(' + this.props.layerGroup.image.card + ') center/cover'}}>
          </div>
          }
        <h2>{this.props.layerGroup.name}</h2>
        <div className="description">
          {Parser(this.props.layerGroup.short_name||"")}
        </div>
      </Link>
    </div>
  }
}
