/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "babel-polyfill";
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'

import Main from '../components/main';
import {createBrowserHistory} from 'history';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import {Router} from 'react-router';
import axios from 'axios';
import initStore from '../stores/stores';
import queryString from 'query-string';

import {getQueryStringValue, getCurrentModals} from '../helpers/modals';

document.addEventListener('DOMContentLoaded', () => {
    if( typeof window.__STATE === "undefined" ) return;
    const userPresent = window.__USER_PRESENT;
    const adminUserPresent = window.__ADMIN_USER_PRESENT;
    const mapBounds = window.__MAP_BOUNDS;
    const mapboxStaticMapsKey = window.__MAPBOX_STATIC_MAPS_KEY;

    const browserHistory = createBrowserHistory();
    const routerStore = new RouterStore();
    const history = syncHistoryWithStore(browserHistory, routerStore);
    history.previousLocalStates = 0;

    // fetch the initial app state then initialize the stores and components
    axios.get('/map/state.json').then((response) => {

        const deserialize = (string) => {
            try {
                return JSON.parse(atob(string))
            } catch(e) {
                return {};
            }
        }

        const queryParams = queryString.parse(location.search);
        console.log('parsed query params',queryParams);

        let stateData = response.data.data;

        if (queryParams.MapViewStore) {
            stateData.map = Object.assign(stateData.map, deserialize(queryParams.MapViewStore));
        }

        if (queryParams.LayersStore) {
            stateData.layers = deserialize(queryParams.LayersStore);
        }

        const stores = initStore(stateData);
        stores.router = routerStore;
        stores.currentUser = window.__USER;
        
        history.subscribe((newLocation, action) => {
            stores.trayViewStore.loading_error = false; // reset any loading errors when we change location

            if( action === "PUSH" ) {
                history.previousLocalStates += 1;
            }
            
            const choosePlace = getQueryStringValue(newLocation, 'choose-place');
            if(choosePlace === "true") {
                stores.mapViewStore.inChoosePlaceMode = true;
            }
            
            stores.mapViewStore.toggleModal('search', false);
            
            const currentModals = getCurrentModals(newLocation);
            if(currentModals) {
                currentModals.map((modal) => stores.mapViewStore.toggleModal(modal, true));
            }
            
            if(currentModals.indexOf('record')<0) {
                stores.mapViewStore.recordModal = false;
                stores.trayViewStore.record = null;
            }
        });

        ReactDOM.render(
            <Provider {...stores} userPresent={userPresent} adminUserPresent={adminUserPresent} mapBounds={mapBounds} mapboxStaticMapsKey={mapboxStaticMapsKey}>
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
            
            if(event.data.action === 'edit') {
                switch (event.data.type) {
                    case 'record':
                        path += '?editRecord='+event.data.id;
                        break;
                    case 'collection':
                        path += '?editCollection='+event.data.id;
                        break;
                    case 'team':
                        path += '/teams/'+event.data.id;
                        break;
                }
            }

            if(event.data.action === 'view') {
                switch (event.data.type) {
                    case 'record':
                        path += '?record='+event.data.id;
                        break;
                    case 'collection':
                        path += '/collections/'+event.data.id;
                        break;
                }
                stores.mapViewStore.accountModal = false
            }

            console.log(path, event.data.action, event.data.type, event.data.id);
            // if (event.data.id) {
            //     path += `=${event.data.id}`;
            // }

            // if (event.data.action) {
            //     path += `/${event.data.action}`;
            // }

            history.push(path);
        }
    },false);
});
