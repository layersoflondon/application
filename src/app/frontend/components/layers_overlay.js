import React,{Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import LayerGroup from './layer_group';
import Equalizer from "./Equalizer";

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
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

  checkRestoreTray(event) {
    if( this.props.layersStore.activeLayerGroups.length === 0 ) {
      this.props.trayViewStore.root = false;
    }
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'layers' ) className += " is-showing";

    return (
      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description' content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`} />
          <meta name='keywords' content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`} />
        </Helmet>
        <div className={className} onClick={this.handleModalBgClick.bind(this)}>
          <div className={`s-overlay--layers is-showing ${this.props.layersStore.activeVisibleLayerGroups.length}-active-layers`}>

            <div className="close">
              <Link to="/map" className="close" onClick={this.checkRestoreTray.bind(this)}>Close</Link>
            </div>

            <div className="m-layers-picker">
              <div className="header">
                <h1>Layers</h1>
              </div>

              <div className="layers">
                <Equalizer selector="a:first-child">
                  {this.props.layersStore.layer_groups.values().map((layer_group) => <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)}
                </Equalizer>
              </div>

              {this.props.layersStore.activeLayerGroups.length &&
                <div className="confirm">
                  <Link to="/map" className="btn" onClick={this.checkRestoreTray.bind(this)}>I'm done!</Link>
                </div>
              }

            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
