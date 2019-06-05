import React, {Component, Fragment} from 'react';
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
    if (event.target.className === "m-overlay") {
    }
  }

  checkRestoreTray(event) {
    if (this.props.layersStore.activeLayerGroups.length === 0) {
      this.props.trayViewStore.root = false;
    }
  }

  render() {
    let className = "m-overlay";
    if (this.props.mapViewStore.overlay === 'layers') className += " is-showing";

    return (
      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description' content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`}/>
          <meta name='keywords' content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`}/>
        </Helmet>
        <div className={className} onClick={this.handleModalBgClick.bind(this)}>
          <div className={`s-overlay--layers is-showing ${this.props.layersStore.activeVisibleLayerGroups.length}-active-layers`}>

            <div className="close">
              <Link to="/map" className="close" onClick={this.checkRestoreTray.bind(this)}>Close</Link>
            </div>

            <div className="m-layers-picker">
              <div className="header">
                <h1>Layers</h1>
                <div className="search">
                  <input placeholder="Search layers" type="text" name="search_layers" value=""/>
                </div>
              </div>

              <div className="layers">
                <div className="section-title">
                  <h2>Highlighted layers</h2>
                </div>
                <Equalizer selector="a:first-child">
                  {this.props.layersStore.layer_groups.values().map((layer_group) =>
                    <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)}
                </Equalizer>
              </div>



              <div className="secondary-layers">
                <div className="section-title">
                  <h2>Layer directory</h2>
                </div>
                <div className="layer">
                  <a href="/map/layers/map-of-the-county-of-essex-by-john-chapman-peter-andre-1777">
                    <div className="image"></div>
                    <h2>Map of the County of Essex by John Chapman &amp; Peter André (1777)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/os-maps-1940s-1960s">
                    <div className="image"></div>
                    <h2>OS Maps (1940s-1960s)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/faithorne-and-newcourt-map-1658">
                    <div className="image"></div>
                    <h2>Faithorne and Newcourt Map (1658)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/horwood-1799">
                    <div className="image"></div>
                    <h2>Horwood (1799)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/greenwood-1828">
                    <div className="image"></div>
                    <h2>Greenwood (1828)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/bomb-damage-1945">
                    <div className="image"></div>
                    <h2>Bomb Damage (1945)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/john-rocque-s-map-of-london-westminster-and-southwark-1746">
                    <div className="image"></div>
                    <h2>John Rocque's map of London, Westminster and Southwark (1746)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/os-maps-1893-1896">
                    <div className="image"></div>
                    <h2>OS Maps (1893-1896)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/modern-satellite-map">
                    <div className="image"></div>
                    <h2>Modern satellite map</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/william-morgan-s-map-of-the-city-of-london-westminster-and-southwark-1682">
                    <div className="image"></div>
                    <h2>William Morgan's Map of the City of London, Westminster and Southwark (1682)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/raf-aerial-collection-1945-1949">
                    <div className="image"></div>
                    <h2>RAF Aerial Collection (1945-1949)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/charles-booth-s-poverty-map-1886-1903">
                    <div className="image"></div>
                    <h2>Charles Booth's Poverty Map (1886-1903)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/tudor-map-1520">
                    <div className="image"></div>
                    <h2>Tudor Map (1520)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>
                <div className="layer">
                  <a href="/map/layers/ogilby-and-morgan-1676">
                    <div className="image"></div>
                    <h2>Ogilby and Morgan (1676)</h2>
                    <div className="description">
                      <p>A Map of Tudor London, in about 1520. Reconstructed by modern historians and archaeologists and published by the Historic Towns Trust in 2018.</p>
                      <span className="credit">
                  <p><em>Digital version courtesy of the Historic Towns Trust.</em></p>
               </span>
                    </div>
                  </a>
                </div>

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
