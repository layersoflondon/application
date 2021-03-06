import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Helmet from 'react-helmet';
import {recordEvent} from "../config/data_layer";
import Parser from 'html-react-parser';
import {getQueryStringValue, removeModal, closeModalLink} from '../helpers/modals';

@inject('mapViewStore', 'layersStore', 'router', 'trayViewStore')
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
    const id = getQueryStringValue(this.props.router.location, 'layer');
    
    if( id ) {
      this.props.layersStore.fetchLayerGroup(id);
    }
  }

  componentDidUpdate() {
    const id = getQueryStringValue(this.props.router.location, 'layer');

    if( id ) {
      this.props.layersStore.fetchLayerGroup(id);
    }
  }

  componentWillUnmount() {
    this.props.layersStore.layer_group_id = null;
    this.props.layersStore.layer_group = null;
  }

  render() {

    const toggleLayer = () => {
      const showing = this.props.layersStore.toggleLayer(this.props.layersStore.layer_group.id);

      const layerGroup = this.props.layersStore.layer_groups.get(this.props.layersStore.layer_group.id);
      const collectionLayers = layerGroup.layers.filter((layer)=>layer.layer_type === 'collection');
      let layerGroupCollectionIds = collectionLayers.map((layer) => layer.layer_data.collection_id);
      layerGroupCollectionIds = [].concat(...layerGroupCollectionIds).map((id) => parseInt(id, 10));

      if( showing ) {
        this.props.trayViewStore.collection_ids = layerGroupCollectionIds;
      }else {
        let currentCollectionIds = this.props.trayViewStore.collection_ids || [];

        layerGroupCollectionIds.forEach((id) => {
          let index = currentCollectionIds.indexOf(id);
          if( index > -1 ) {
            currentCollectionIds.splice(index, 1);
          }
        });
      }

      this.props.layersStore.pushUrlParam();

      recordEvent('layerSelected', {
        'layerSelected': this.props.layersStore.activeLayerGroups.map((layer) => layer.title).join(" | ")
      });
    }

    const handleCloseOnClick = (e) => {
      // instead of using a <Link> element for the close button, we use an onclick so we don't accidentally destroy the state in the url.
      e.preventDefault();

      removeModal(window.location, 'layer', this.props.mapViewStore);
      this.props.router.push(closeModalLink(window.location, 'layer'))
    };

    const toggleLayerAndClose = (e) => {
      e.preventDefault();

      toggleLayer();
      handleCloseOnClick(e);




    }

    if(!this.props.mapViewStore.modalIsVisible('layer')) return <React.Fragment />;

    let className = "m-overlay is-showing";

    let imgStyle = {};
    if( this.props.layersStore.layer_group && this.props.layersStore.layer_group.image ) {
      imgStyle.backgroundImage = `url(${this.props.layersStore.layer_group.image['large']})`;
    }

    const label_prefix = this.props.layersStore.layer_group && this.props.layersStore.layer_group.is_active ? "Remove" : "Use";

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
              <a href="#" className="close" onClick={handleCloseOnClick}>Close</a>
            </div>

            {
              !!!this.props.layersStore.loading && this.props.layersStore.layer_group && (
                <div className="m-layer-details">
                  <div className="header">
                    <h1>{this.props.layersStore.layer_group.name}</h1>
                  </div>

                  <div className="image" style={imgStyle}></div>

                  <div className="description">
                    <div className="text-content">
                      {Parser(this.props.layersStore.layer_group.description)}
                    </div>
                  </div>

                  <div className="data">
                    <h2 className="subtitle">Available data</h2>
                    <div className="text-content">
                      <ul>
                        {this.props.layersStore.layer_group.layers.map((l, i) => <li key={i}>{l.title}</li>)}
                      </ul>
                    </div>
                    {/*<a className="download-link" href={`/layers/${this.props.layersStore.layer_group.slug}/export`} download>Download (.XLS format)</a>*/}
                  </div>

                  <div className="footer">
                    <a href="#" className="use-this-layer" onClick={toggleLayerAndClose}>{label_prefix} this layer</a>
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
