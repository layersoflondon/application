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

import {createBrowserHistory} from 'history';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import { Router, Route } from 'react-router';

import { getUserSession } from './maptools/sources/user_session';
import MapToolsStore from './maptools/stores/maptools_store';

import MapView from './maptools/components/map_view';
import MapToolsContainer from './maptools/components/maptools_container';
import MapToolsOverview from './maptools/components/maptools_overview';

import _ from './maptools/helpers/leaflet-config';

document.addEventListener('DOMContentLoaded', async () => {
    const browserHistory = createBrowserHistory();
    const routerStore = new RouterStore();
    const history = syncHistoryWithStore(browserHistory, routerStore);

    const mapToolsStore = new MapToolsStore();
    const userSession = await getUserSession();

    await mapToolsStore.fetchPolygons();
    await mapToolsStore.fetchSquares();
    await mapToolsStore.fetchSquareGrid();
    await mapToolsStore.fetchSquareCoordinates();

    const stores = {
        mapToolsStore: mapToolsStore,
        userSession: userSession.data
    };

    window.stores = stores;

    ReactDOM.render(
        <Provider {...stores}>
            <Router history={history}>
                <React.Fragment>
                    <Route component={MapView} />
                    <Route path='/maptools' component={MapToolsContainer} />
                    <Route exact path='/maptools' component={MapToolsOverview} />
                </React.Fragment>
            </Router>
        </Provider>,
        document.getElementById("maptools-root")
    );
});
