import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import LayerGroup from './layer_group';
import Equalizer from "./Equalizer";
import {debounce} from "underscore";
import Layer from '../sources/layer';

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
@withRouter
@observer export default class LayersOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {query: ""};

    const _filter = () => (Layer.search(this.state).then((response) => {
      this.setState({ids: response.data.map((i)=>i.id)});
    }));

    this.filter = debounce(_filter, 1000);
  }

  layerGroupFilter(event) {
    this.setState({...this.state, query: event.currentTarget.value});
    this.filter();
  }

  handleClick(event) {
    this.router.history.goBack();
  }

  updateQuery(event) {
    this.setState({query: event.currentTarget.value});
    this.filter();
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

    const highlightedLayers = this.props.layersStore.highlightedLayerGroups.filter((layer_group)=>layer_group.inFilter(this.state.ids));
    const layerDirectoryLayers = this.props.layersStore.layerGroups.filter((layer_group)=>layer_group.inFilter(this.state.ids));

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
                  <input placeholder="Search layers" type="text" name="search_layers" value={this.state.query} onChange={this.layerGroupFilter.bind(this)} />
                </div>
              </div>

              {highlightedLayers.length && (
                <div className="layers">
                  <div className="section-title">
                    <h2>Highlighted layers</h2>
                  </div>
                  <Equalizer selector="a:first-child">
                    {highlightedLayers.map((layer_group) =>
                      <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
                    }
                  </Equalizer>
                </div>
              )}

              {layerDirectoryLayers.length && (
                <div className="secondary-layers">
                  <div className="section-title">
                    <h2>Layer directory</h2>
                  </div>

                  {layerDirectoryLayers.map((layer_group) =>
                    <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
                  }
                </div>
              )}

              {/*{Array(this.state.total_pages).fill().map((_,i)=>i+1).map((p, i)=><div key={`layer-group-page-${i}`}>{p}</div>)}*/}

              {this.props.layersStore.activeLayerGroups.length>0 &&
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
