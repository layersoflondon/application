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
import TrayViewStore from '../stores/tray_view_store';
import Main from '../components/main';

// to test following snippet we should remove the default format of the route -defaults: {format: :json}- and
// add upload new file via form in http://localhost:3000/records/1/attachments/new and add new action
// document.addEventListener('DOMContentLoaded', () => {
//     var output = document.getElementById('output');
//     document.getElementById('upload').onclick = function () {
//         var data = new FormData();
//         data.append('attachable_attributes[title]', 'title');
//         data.append('attachable_attributes[caption]', 'caption');
//         data.append('attachable_attributes[credit]', 'credit');
//         data.append('attachable_attributes[description]', 'description');
//         data.append('attachment_type', 'dataset');
//         data.append('file', document.getElementById('file').files[0]);
//         RecordAttachments.create(1, data).then((response)=>{
//             RecordAttachments.destroy(record_id, response.data[response.data.length - 1].id)
//                 .then((response)=>{})
//                 .catch((error) => {});
//         }).catch((error) => {});
//     };
// });

/**
 * Create a CardStore from our dummy data, a TrayViewStore to pass
 * into the React App, and set the initial data for the trayViewStore
 * which will be rendered in the Tray component
 */

import RecordStore from '../stores/record_store';
import CollectionStore from '../stores/collection_store';

import RecordModel from '../models/record';
import CollectionModel from '../models/collection';
import RecordFormStore from "../stores/record_form_store";

import LayerModel from '../models/layer';
import LayersStore from '../stores/layers_store';

document.addEventListener('DOMContentLoaded', () => {
  if( typeof window.lol_app_data === "undefined" ) return;
  const collection_store = new CollectionStore();
  const record_store     = new RecordStore();

  window.lol_app_data.records.map((o) => {
    let record = RecordModel.fromJS(o);
    record_store.records.push(record);
  });

  window.lol_app_data.collections.map((o)=> {
    let collection = new CollectionModel.fromJS(o);
    let collection_array = collection_store[`${o.write_state}_collections`].slice();
    collection_array.push(collection);
    collection_store[`${o.write_state}_collections`] = collection_array;
  });

  const cardStore = new CardStore();
  cardStore.rootCardStore = true; // initialise this as the root store (no close button on the list header)

  /**
  the TrayViewStore manages what we're displaying in the tray via its cardStore (the array of cards) that
  can either be related to a Record, or a Collection with an array of Records.
  Iterate over our instantiated Record and Collection stores and add their objects to the list of things to initially show
  */
  cardStore.addRecords(record_store);
  cardStore.addCollections(collection_store);

  const tray_view_store = new TrayViewStore();
  tray_view_store.cardStore = cardStore;

  const map_view_store = new MapViewStore();

  const record_form_store = new RecordFormStore();
  const layers_data = [
    {id: 1, title: "Roque map", description: "<p>The Roque Map description</p>", date: new Date(), url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false},
    {id: 2, title: "Morgan map", description: "<p>The Morgan map description</p>", date: new Date(), url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false}
  ];

  // fixme - figure out why layersoflondon-tiles.error.agency is returning 404's
  // const layers_data = [
  //   {id: 1, title: "Roque Map", description: "<p>Roque Map description</p>", date: new Date(), url: "https://layersoflondon-tiles.error.agency/rocque/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false},
  //   {id: 2, title: "Morgan Map", description: "<p>Morgan Map description</p>", date: new Date(), url: "https://layersoflondon-tiles.error.agency/morgan/{z}/{x}/{y}.png", attribution: "Some Attribution", opacity: 1, enabled: false},
  //   {id: 3, title: "Satellite View", description: "<p>Satellite View description</p>", date: new Date(), url: "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", attribution: "Some Attribution", opacity: 1, enabled: false}
  // ];

  const layers = layers_data.reverse().map((ld) => LayerModel.fromJS(ld));
  const layers_store = new LayersStore();
  layers_store.layers = layers;

  ReactDOM.render( <Main recordFormStore={record_form_store} trayViewStore={tray_view_store} mapViewStore={map_view_store} collectionStore={collection_store} recordStore={record_store} layersStore={layers_store} />, document.getElementById("map-root") );

  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  // Listen to message from child window
  eventer(messageEvent,function(e) {
    if (e.data.scope == 'clickable-iframe-element') {
        map_view_store.overlay = null;
        // TODO: Open requested modal
        setTimeout(function() {
            alert('TODO: Open modal ' + e.data.type + ': ' + e.data.id);
        },500);
    }
  },false);
});
