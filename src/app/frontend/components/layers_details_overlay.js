import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import Layer from './layer';

const imgStyle = {
  backgroundImage: 'url(https://assets-development.layersoflondon.org/variants/v3ZtHxkSH4pZpTXU3DKQxXEV/fae2d9fd4e9251a8a9a25d6fcf1728562a06fa5eaf9b596d60573536fb03c23f)'
};

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

  render() {
    let className = "m-overlay";
    if (this.props.mapViewStore.overlay === 'layer-details') className += " is-showing";

    return (
      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description' content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`}/>
          <meta name='keywords' content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`}/>
        </Helmet>
        <div className={className} onClick={this.handleModalBgClick.bind(this)}>
          <div className="s-overlay--layers is-showing">

            <div className="close">
              <Link to="/map/layers" className="close">Close</Link>
            </div>

            <div className="m-layer-details">
              <div className="header">
                <h1>Morgan Map</h1>
              </div>

              <div className="image" style={imgStyle}></div>

              <div className="description">
                <div className="text-content">
                  <p>Survey of the City of London and the surrounding built-up area (including Westminster and part of
                  Southwark), on a scale of 300 feet to the inch, completed in 1682 by William Morgan. From a facsimile
                  published by Harry Margary in association with the Guildhall Library in 1977.</p>

                  <p>Survey of the City of London and the surrounding built-up area (including Westminster and part of
                    Southwark), on a scale of 300 feet to the inch, completed in 1682 by William Morgan. From a facsimile
                    published by Harry Margary in association with the Guildhall Library in 1977.</p>
                </div>
              </div>

              <div className="data">
                <h2 className="subtitle">Available data</h2>
                <div className="text-content">
                  <ul>
                    <li>Places polygons</li>
                    <li>Places points</li>
                    <li>Parishes polygons and centroid points</li>
                    <li>Wards polygons and centroid points</li>
                  </ul>
                </div>
                <a href="#" className="download-link">Download (.XLS format)</a>
              </div>

              <div className="footer">
                <a href="#" className="use-this-layer">Use this layer</a>
              </div>

            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
