import React,{Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import Layer from './layer';

@inject('mapViewStore', 'layersStore', 'router')
@withRouter
@observer export default class LayerDetailsOverlay extends Component {
  constructor(props) {
    super(props);
  }

  handleModalBgClick(event) {
    if( event.target.className === "m-overlay" ) {
    }
  }

  componentWillMount() {
    if( this.props.match.params.id ) {
      this.props.layersStore.fetchLayerGroup(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.layersStore.layer_group_id = null;
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'layer-details' ) className += " is-showing";

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
              <Link to="/map/layers" className="close">Close</Link>
            </div>

            <div className="m-layers-picker">
              <div className="header">
                <h1>Layer Details</h1>
              </div>

              {
                this.props.layersStore.layer_group &&
                <div>
                  <p>{this.props.layersStore.layer_group.name}</p>
                  <p>{this.props.layersStore.layer_group.description}</p>
                </div>
              }

              {
                this.props.layersStore.layer_group && this.props.layersStore.layer_group.image &&
                <div>
                  <p>{this.props.layersStore.layer_group.image['large']}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
