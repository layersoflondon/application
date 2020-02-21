import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import LayerGroup from './layer_group';
import Equalizer from "./Equalizer";
import {closeModalLink, removeModal} from '../helpers/modals';
import pluralize from 'pluralize';
import LayerTypeNavigation from './layer_type_navigation';

const LAYERS_PER_PAGE = 9;

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
@withRouter
@observer export default class LayersOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      ids: null,
      searching: false,
      page: 1,
      query_params: {}
    };

    this.filter = () => {
      this.setState({searching: true});

      const query_params = this.state.query_params || {};
      let query = {
        query: this.state.query,
        ...query_params
      };

      const updateState = (additionalState) => {
        const state = {
          searching: false,
          page: 1,
          per_page: LAYERS_PER_PAGE,
          ...additionalState
        };

        this.setState(state);
      };

      this.props.layersStore.search(query, true, updateState);
    };

    this.handleFetchNextPageClick = () => {
      if(this.state.searching) return false;

      this.setState({searching: true});

      const query_params = this.state.query_params || {};
      let query = {
        query: this.state.query,
        page: this.state.page+1,
        per_page: LAYERS_PER_PAGE,
        ...query_params
      };

      const updateState = (additionalState) => {
        const state = {
          searching: false,
          page: this.state.page+1,
          per_page: LAYERS_PER_PAGE,
          ...additionalState
        };

        this.setState(state);
      };

      this.props.layersStore.search(query, false, updateState);
    };

    this.addLayerTypeFilter = (event) => {
      this.setState({searching: true});

      const termId = parseInt(this.props.layersStore.category_id, 10);

      let state;
      if(termId) {
        state = {query_params: {...this.state.query_params, layer_term:  termId}};
        delete state.query_params.overview; // remove the overview param to remove the highlighted section
      }else {
        console.log("Reset")
        state = {query_params: {...this.state.query_params, overview: true}};
        delete state.query_params.layer_term; // reset the layer term query
      }

      this.setState(state);

      setTimeout(() => this.filter(), 500);
    };

    this.showMore = () => {
      return (typeof this.state.totalPages === "undefined" || this.state.page<this.state.totalPages);
    };
  }

  updateLayerGroupFilter(event) {
    this.setState({...this.state, query: event.currentTarget.value});
  }

  handleModalBgClick(event) {
    if (event.target.className === "m-overlay") {
    }
  }

  handleReturn(event) {
    if (event.key === 'Enter' && this.state.searching === false) {
      this.filter();
    }
  }

  checkRestoreTray(event) {
    if (this.props.layersStore.activeLayerGroups.length === 0) {
      this.props.trayViewStore.root = false;
    }
  }

  render() {
    if(!this.props.mapViewStore.modalIsVisible('layers')) return <React.Fragment />;

    let className = "m-overlay is-showing";

    const highlightedLayers = this.props.layersStore.highlightedLayerGroups;
    const layerDirectoryLayers = this.props.layersStore.layerGroups;

    const handleOnClick = () => {
      removeModal(this.props.router.location, 'layers', this.props.mapViewStore);
    };

    const handleResetSearchOnClick = () => {
      this.setState( {
        query: '',
        query_params: {overview: true}
      });

      setTimeout(() => {
        this.filter();
      }, 250);
    };

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
              <Link to={closeModalLink(this.props.router.location, 'layers')} className="close" onClick={handleOnClick}>Close</Link>
            </div>

            <div className="m-layers-picker">
              <div className="header">
                <h1>Layers</h1>
                {this.props.layersStore.activeLayerGroups.length > 0 &&

                <div className="status">
                      <span>{pluralize('layer', this.props.layersStore.activeLayerGroups.length, true)} currently selected</span>
                      <a href="#" onClick={this.props.layersStore.clearActiveLayerGroups}><i className="fa fa-times" aria-hidden="true"></i> Clear all</a>
                  </div>
                }

                <div className="search">
                  <input placeholder="Search layers" type="text" name="search_layers" value={this.state.query} onKeyUp={this.handleReturn.bind(this)} onChange={this.updateLayerGroupFilter.bind(this)}/>
                  <button className="btn" disabled={this.state.query.length > 0 ? false : true} onClick={this.filter}>Go</button>

                  {this.state.query.length > 0 &&
                    <span className="clear-search" onClick={handleResetSearchOnClick}>
                      &times;
                    </span>
                  }
                </div>
              </div>

              {highlightedLayers.length > 0 && (
                <div className="layers layers--featured">
                  <div className="section-title">
                    <h2>Featured layers</h2>
                  </div>
                  <Equalizer selectcurrently selectedor="a:first-child">
                    {highlightedLayers.map((layer_group) =>
                      <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
                    }
                  </Equalizer>
                </div>
              )}

              <LayerTypeNavigation filterCallback={this.addLayerTypeFilter} categories={this.props.layersStore.categories} />

              {layerDirectoryLayers.length > 0 && (
                <div className="layers layers--all">
                  <div className="section-title">
                    <h2>All layers</h2>
                  </div>

                  {layerDirectoryLayers.map((layer_group) =>
                    <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
                  }
                </div>
              )}

              {this.showMore() &&
              <div className="section-load-more">
                <button onClick={this.handleFetchNextPageClick}>
                  Show more
                </button>
              </div>
              }

              {layerDirectoryLayers.length === 0 && highlightedLayers.length === 0 && (
                <div className="no-results">There are no layers which match your search.</div>
                )}

              {/*{Array(this.state.total_pages).fill().map((_,i)=>i+1).map((p, i)=><div key={`layer-group-page-${i}`}>{p}</div>)}*/}

              {this.props.layersStore.activeLayerGroups.length > 0 &&
                <div className="confirm">
                  <Link to={closeModalLink(this.props.router.location, 'layers')} className="btn" onClick={handleOnClick}>I'm done!</Link>
                </div>
              }

            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
