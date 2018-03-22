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

import Main from '../components/main';

import faker from 'faker';

const cards = [
  {
    id: 1,
    name: `${faker.commerce.productName()}`,
    description: faker.lorem.paragraphs(2),
    image: faker.image.dataUri(),
    is_collection: false,
    records: [{id: 1, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.1, -0.11]}]
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

const cardStore = CardStore.fromJS(cards); //new CardStore();
const mapViewStore = new MapViewStore();
mapViewStore.currentCardStore = cardStore;

window.cardStore = cardStore;
window.mapViewStore = mapViewStore;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render( <Main cardStore={cardStore} mapViewStore={mapViewStore} />, document.getElementById("map-root") );
});
