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

import Main from '../components/main';

import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import {Router} from 'react-router';

/**
 * Create a CardStore from our dummy data, a TrayViewStore to pass
 * into the React App, and set the initial data for the trayViewStore
 * which will be rendered in the Tray component
 */

import initStore from '../stores/stores';

document.addEventListener('DOMContentLoaded', () => {
  if( typeof window.__STATE === "undefined" ) return;

  const browserHistory = createBrowserHistory();
  const routingStore = new RouterStore();
  const history = syncHistoryWithStore(browserHistory, routingStore);

  const stores = initStore(__STATE);
  stores.routing = routingStore;

  ReactDOM.render(
    <Provider {...stores} >
      <Router history={history}>
        <Main />
      </Router>
    </Provider>,
    document.getElementById("map-root")
  );
});
