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
import Record from '../sources/record';

Record.all().then((response)=>{
  console.log("Request succeeded: \n\n")
  console.log("Response", response);
  console.log("Response status", response.status);
  console.log("Response statusText", response.statusText);
  console.log("Response data", response.data); // the record objects
  // console.log(response.headers);
  // console.log(response.request);
  // console.log(response.config);
}).catch((error) => {
  console.log("Request error: ", error);
});

import CardStore from '../stores/card_store';
import MapViewStore from '../stores/map_view_store';
import TrayViewStore from '../stores/tray_view_store';

import Main from '../components/main';

import faker from 'faker';

const cards = [
  {
    id: 1,
    name: `${faker.commerce.productName()}`,
    description: faker.lorem.paragraphs(2),
    image: faker.image.dataUri(),
    is_collection: false,
    period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
    position: [51.1, -0.11]
  },
  {
    id: 2,
    name: `${faker.commerce.productName()}`,
    description: faker.lorem.paragraphs(2),
    image: faker.image.dataUri(),
    is_collection: true,
    records: [
      {id: 2, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.21, -0.51]},
      {id: 3, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.41, -0.59]},
      {id: 4, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.81, -0.39]},
      {id: 5, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [50.91, -0.49]}
    ]
  }
];

/**
 * Create a CardStore from our dummy data, a TrayViewStore to pass
 * into the React App, and set the initial data for the trayViewStore
 * which will be rendered in the Tray component
 */

const cardStore = CardStore.fromJS(cards);
const trayViewStore = new TrayViewStore();
trayViewStore.cardStore = cardStore;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render( <Main trayViewStore={trayViewStore} />, document.getElementById("map-root") );
});
