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
import axios from 'axios';
import initStore from '../stores/stores';

document.addEventListener('DOMContentLoaded', () => {
    if( typeof window.__STATE === "undefined" ) return;
    const userPresent = window.__USER_PRESENT;

    const browserHistory = createBrowserHistory();
    const routingStore = new RouterStore();
    const history = syncHistoryWithStore(browserHistory, routingStore);

    // // initialise the application with static data
    // const stores = initStore({data: {tray: {root: true, cards: []}, collections: [], layers: [], map: {zoom: 10}}});
    //
    // stores.routing = routingStore;
    // ReactDOM.render(
    //   <Provider {...stores} >
    //     <Router history={history}>
    //       <Main />
    //     </Router>
    //   </Provider>,
    //   document.getElementById("map-root")
    // );

    // fetch the initial app state then initialize the stores and components
    axios.get('/map/state.json').then((response) => {
        const stores = initStore(response.data);
        stores.router = routingStore;

        ReactDOM.render(
          <Provider {...stores} userPresent={userPresent} >
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
        // fixme: restore this functionality using the new router pattern
        if (false && event.data.scope === 'clickable-iframe-element') {
            stores.mapViewStore.overlay = null;
            // TODO: Open requested modal
            const {push} = routingStore;

            setTimeout(() => {
                switch(event.data.type) {
                    case 'record':
                        push(`/map/records/${event.data.id}`);
                        stores.trayViewStore.record_id = event.data.id;
                        break;
                    case 'collection':
                        push(`/map/collections/${event.data.id}`);
                        stores.trayViewStore.collection_id = event.data.id;
                    default:
                        console.log(`Handle ${event.data.type}`);
                }
            }, 500);
        }
    },false);
});
