import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Layer from './layer';

@inject('mapViewStore', 'layersStore', 'router')
@withRouter
@observer export default class LayersOverlay extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(event) {
    this.router.history.goBack();
  }

  handleModalBgClick(event) {
    if( event.target.className === "m-overlay" ) {
    }
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'layers' ) className += " is-showing";

    return (
      <div className={className} onClick={this.handleModalBgClick.bind(this)}>
        <div className="s-overlay--layers is-showing">

          <div className="close">
            <Link to="/map" className="close">Close</Link>
          </div>

          <div className="m-layers-picker">
            <div className="header">
              <h1>Layers</h1>

              <p>
                Activate the following layers on the map
              </p>
            </div>

            <div className="layers">
              <h2>All Layers</h2>
              {this.props.layersStore.layers.values().map((layer) => <Layer key={layer.id} layer={layer} {...this.props} />)}
            </div>

          </div>
        </div>
      </div>
    );
  }
}
