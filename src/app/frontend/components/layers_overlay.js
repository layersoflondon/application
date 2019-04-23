import React,{Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
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
      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description' content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`} />
          <meta name='keywords' content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`} />
        </Helmet>
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
                {this.props.layersStore.layer_groups.values().map((layer_group) => <Layer key={layer_group.id} layer={layer_group} {...this.props} />)}
              </div>

            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
