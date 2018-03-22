/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import React,{Component} from 'react'
import ReactDOM from 'react-dom'

import CardStore from '../stores/card_store';
import MapViewStore from '../stores/map_view_store';
import CollectionStore from '../stores/collection_store';

import Main from '../components/main';

const cardStore = new CardStore();
const mapViewStore = new MapViewStore();
const collectionStore = new CollectionStore();

window.cardStore = cardStore;
window.mapViewStore = mapViewStore;
window.collectionStore = collectionStore;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render( <Main cardStore={cardStore} mapViewStore={mapViewStore} collectionStore={collectionStore} />, document.getElementById("map-root") );
});
