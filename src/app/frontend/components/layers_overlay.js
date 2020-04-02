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
      free_text_query: ""
    };


  }

  componentWillMount() {
    this.props.layersStore.category_id = 1;
  }

  freeTextSearch() {
    this.props.layersStore.free_text_query = this.state.free_text_query;
  }

  setFreeTextQuery(event) {
    this.setState({free_text_query: event.currentTarget.value})
  }

  clearFreeTextQuery() {
    this.props.layersStore.free_text_query = this.state.free_text_query = ""
  }

  handleFetchNextPageClick() {

    this.props.layersStore.search_page += 1;
  };

  handleModalBgClick(event) {
    if (event.target.className === "m-overlay") {
    }
  }

  handleReturn(event) {
    if (event.key === 'Enter' && !!!this.props.layersStore.loading) {
      this.freeTextSearch();
    }
  }

  checkRestoreTray(event) {
    if (this.props.layersStore.activeLayerGroups.length === 0) {
      this.props.trayViewStore.root = false;
    }
  }


  renderHeader() {


    const activeLayerGroups = (this.props.layersStore.activeLayerGroups.length > 0) ? (
      <div className="status">
        <span>{pluralize('layer', this.props.layersStore.activeLayerGroups.length, true)} currently selected</span>
        <a href="#" onClick={this.props.layersStore.clearActiveLayerGroups}><i className="fa fa-times"
                                                                               aria-hidden="true"/> Clear
          all</a>
      </div>
    ) : (<React.Fragment/>);

    const clearButton = (this.state.free_text_query.length) ? (
      <span className="clear-search" onClick={this.clearFreeTextQuery.bind(this)}>
        &times;
      </span>
    ) : (<React.Fragment/>);

    return (
      <React.Fragment>
        <h1>Layers</h1>

        {activeLayerGroups}

        <div className="search">
          <input placeholder="Search layers" type="text" name="search_layers" value={this.state.free_text_query}
                 onKeyUp={this.handleReturn.bind(this)} onChange={this.setFreeTextQuery.bind(this)}/>
          <button className="btn" disabled={this.props.layersStore.loading}
                  onClick={this.freeTextSearch.bind(this)}>Go
          </button>

          {clearButton}
        </div>
      </React.Fragment>

    )
  }

  renderHighlighted() {

    if (!!!this.props.layersStore.loading && !!!this.props.layersStore.searchQueriesPresent && this.props.layersStore.highlightedLayerGroups.length) {
      return (

        <div className="layers layers--featured">

          <div className="section-title">
            <h2>Featured layers</h2>
          </div>


          <Equalizer selector="a:first-child">
            {this.props.layersStore.highlightedLayerGroups.slice(0, 4).map((layer_group) =>
              <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
            }
          </Equalizer>
        </div>
      )
    } else {
      return (
        <React.Fragment/>
      )
    }

  }

  renderSearchResults() {

    const title = (
      <div className="section-title">
        <h2>
          All layers
        </h2>
      </div>
    );

    if (this.props.layersStore.layerGroups.length) {
      return (
        <div className="layers layers--all">
          {title}


          <LayerTypeNavigation categories={this.props.layersStore.categories}/>
          <Equalizer selector="a:first-child">
            {this.props.layersStore.layerGroups.map((layer_group) =>
              <LayerGroup key={layer_group.id} layerGroup={layer_group} {...this.props} />)
            }
          </Equalizer>
        </div>
      )
    } else if (this.props.layersStore.searchQueriesPresent && this.props.layersStore.layerGroups.length === 0 && this.props.layersStore.highlightedLayerGroups.length === 0) {

      return (

        <div className="layers layers--all">
          {title}
          <React.Fragment>
            <LayerTypeNavigation categories={this.props.layersStore.categories}/>
            <div className="no-results">There are no layers which match your search.</div>

          </React.Fragment>
        </div>
      )
    } else {
      return(
        <React.Fragment />
      )
    }
  }


  render() {


    if (!this.props.mapViewStore.modalIsVisible('layers')) return <React.Fragment/>;

    const handleCloseOnClick = () => {
      removeModal(this.props.router.location, 'layers', this.props.mapViewStore);
    };

    return (


      <Fragment>
        <Helmet>
          <title>View Layers | Layers of London | Recording the Layers of London's Rich Heritage</title>
          <meta name='description'
                content={`Add historical layers to your map, and explore thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`}/>
          <meta name='keywords'
                content={`layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`}/>
        </Helmet>
        <div className="m-overlay is-showing" onClick={this.handleModalBgClick.bind(this)}>
          <div
            className={`s-overlay--layers is-showing ${this.props.layersStore.activeVisibleLayerGroups.length}-active-layers`}>

            <div className="close">
              <Link to={closeModalLink(this.props.router.location, 'layers')} className="close"
                    onClick={handleCloseOnClick}>Close</Link>
            </div>

            <div className={`m-layers-picker ${this.props.layersStore.loading ? 'is-loading' : ''}`}>
              <div className="header">
                {
                  this.renderHeader()
                }
              </div>
              
              {/*{*/}
              {/*  this.renderHighlighted()*/}
              {/*}*/}

              {
                this.renderSearchResults()
              }


              {(this.props.layersStore.search_page < this.props.layersStore.total_search_result_pages) &&
              <div className="section-load-more">
                <button onClick={this.handleFetchNextPageClick.bind(this)}>
                  Show more
                </button>
              </div>
              }


              {/*{Array(this.state.total_pages).fill().map((_,i)=>i+1).map((p, i)=><div key={`layer-group-page-${i}`}>{p}</div>)}*/}

              {this.props.layersStore.activeLayerGroups.length > 0 &&
              <div className="confirm">
                <Link to={closeModalLink(this.props.router.location, 'layers')} className="btn"
                      onClick={handleCloseOnClick}>I'm
                  done!</Link>
              </div>
              }
            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
