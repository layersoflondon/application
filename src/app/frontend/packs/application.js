/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "babel-polyfill";
import React from 'react'
import ReactDOM from 'react-dom'

import Main from '../components/main';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import {Router} from 'react-router';
import axios from 'axios';
import initStore from '../stores/stores';

document.addEventListener('DOMContentLoaded', () => {
    if( typeof window.__STATE === "undefined" ) return;
    const userPresent = window.__USER_PRESENT;
    const adminUserPresent = window.__ADMIN_USER_PRESENT;

    const browserHistory = createBrowserHistory();
    const routerStore = new RouterStore();
    const history = syncHistoryWithStore(browserHistory, routerStore);

    // fetch the initial app state then initialize the stores and components
    axios.get('/map/state.json').then((response) => {
        const stores = initStore(response.data);
        stores.router = routerStore;
        stores.currentUser = window.__USER;

        ReactDOM.render(
          <Provider {...stores} userPresent={userPresent} adminUserPresent={adminUserPresent}>
            <Router history={history} >
              <Main />
            </Router>
          </Provider>,
          document.getElementById("map-root")
        );
    });

    const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    const eventer = window[eventMethod];
    const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent, (event) => {
        if (event.data.scope === 'clickable-iframe-element') {
            let path = "/map";
            if (event.data.type && event.data.id) {
                switch (event.data.type) {
                  case 'record':
                      path += '/records';
                      break;
                  case 'collection':
                      path += '/collections';
                      break;
                  case 'team':
                      path += '/teams';
                      break;
                }

                if (event.data.id) {
                    path += `/${event.data.id}`;
                }

                if (event.data.action) {
                    path += `/${event.data.action}`;
                }

                history.push(path);
            }
        }
    },false);
});
