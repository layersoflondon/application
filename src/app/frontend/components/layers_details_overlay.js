import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import {recordEvent} from "../config/data_layer";

@inject('mapViewStore', 'layersStore', 'router')
@withRouter
@observer export default class LayerDetailsOverlay extends Component {
  constructor(props) {
    super(props);
  }

  handleModalBgClick(event) {
    if (event.target.className === "m-overlay") {
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

  toggleLayer(event) {
    event.preventDefault();

    this.props.layersStore.toggleLayer(this.props.layersStore.layer_group.id);

    recordEvent('layerSelected', {
      'layerSelected': this.props.layersStore.active_layer_groups.values().map((layer) => layer.title).join(" | ")
    });

    // return false;
  }

  render() {
    let className = "m-overlay";
    if (this.props.mapViewStore.overlay === 'layer-details') className += " is-showing";

    let imgStyle = {};
    if( this.props.layersStore.layer_group && this.props.layersStore.layer_group.image ) {
      imgStyle.backgroundImage = `url(${this.props.layersStore.layer_group.image['large']})`;
    }

    const label_prefix = (this.props.layersStore.layer_group && this.props.layersStore.layer_group.slug === this.props.match.params.id && this.props.layersStore.layer_group.is_active) ? "Don't use" : "Use";

    return (
      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description' content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`}/>
          <meta name='keywords' content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`}/>
        </Helmet>
        <div className={className} onClick={this.handleModalBgClick.bind(this)}>
          <div className={`s-overlay--layers is-showing ${(this.props.layersStore.layer_group && this.props.layersStore.layer_group.is_active) ? "is-selected" : ""}`}>

            <div className="close">
              <Link to="/map/layers" className="close">Close</Link>
            </div>

            {
              this.props.layersStore.layer_group && (
                <div className="m-layer-details">
                  <div className="header">
                    <h1>{this.props.layersStore.layer_group.name}</h1>
                  </div>

                  <div className="image" style={imgStyle}></div>

                  <div className="description">
                    <div className="text-content">
                      {this.props.layersStore.layer_group.description}
                    </div>
                  </div>

                  <div className="data">
                    <h2 className="subtitle">Available data</h2>
                    <div className="text-content">
                      <ul>
                        {this.props.layersStore.layer_group.layers.map((l, i) => <li key={i}>{l.name}</li>)}
                      </ul>
                    </div>
                    <a href="#" className="download-link">Download (.XLS format)</a>
                  </div>

                  <div className="footer">
                    <a href="#" className="use-this-layer" onClick={this.toggleLayer.bind(this)}>{label_prefix} this layer</a>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </Fragment>
    );
  }
}
