/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import React from 'react'
import ReactDOM from 'react-dom'

import Map from '../components/map/map';
console.log("This is an instance of Map created at the pack entry point in application.js", new Map());

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Map name="React" />,
    document.body.appendChild(document.createElement('div')),
  )
});
