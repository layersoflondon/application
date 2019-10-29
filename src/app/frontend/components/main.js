import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import { Route, Switch } from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import Helmet from 'react-helmet';

import TrayContainer from './tray_container';
import TrayRecordsIndex from './tray/records_index';
import TrayCollectionsIndex from './tray/collections_index';
import TrayCollection from './tray/collection';
import TrayUserRecordsIndex from './tray/user_records_index';
import TrayTeamRecordsIndex from './tray/team_records_index';
import TrayGettingStarted from './tray/getting_started';
import TraySearchResults from './tray/search_results';


import Tools from './tools';
import MapView from './map_view';
import SearchView from './forms/search/search_view';
import RecordView from './record_view_wrapper';
import RecordViewReport from './record_view/record_view_report';
import MediaView from './media_view';
import MediaItem from './media_item';
import CollectionView from './collection_view';
import UserView from './user_view';
import TeamView from './team_view';
import PlacePicker from './place_picker';
import LayersOverlay from './layers_overlay';
import LayerDetailsOverlay from './layers_details_overlay';

import CollectionForm from './forms/collections/collection_form';
import UserForm from './forms/user/user_form';
import RecordForm from './forms/records/record_form';
import ErrorBoundary from "./error_boundary";
import NotFound from "./not_found";
import AddToCollection from "./record_view/add_to_collection";
import RecordTags from "./forms/records/record_tags";

@inject('router', 'recordFormStore', 'trayViewStore', 'mapViewStore', 'collectionStore', 'layersStore', 'collectionFormStore')
@withRouter
@observer export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = "m-map-wrapper";
    if( !this.props.trayViewStore.tray_is_visible ) {
      className += " tray-is-closed";
    }

    return <div className={className}>
      <Helmet>
        <title>Explore layers and records | Layers of London | Recording the Layers of London's Rich Heritage</title>
        <meta name='description' content="Explore layers and records on the Layers of London map, record your own history of London, and help us build more layers" />
        <meta name='keywords' content="layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study" />
      </Helmet>

      {/*permanantly visible components */}

      <ErrorBoundary><Tools/></ErrorBoundary>
      <ErrorBoundary>
        <TrayContainer>
          <Switch>
            <Route exact path='/map' component={TrayGettingStarted} />
            <Route exact path='/map/search' component={TraySearchResults} />
            <Route exact path='/map/collections' component={TrayCollectionsIndex} />
            <Route exact path='/map/:lat,:lng' render={({match})=> {
              return <TrayRecordsIndex type='geobounded' lat={match.params.lat} lng={match.params.lng} />
            }} />
            <Route exact path='/map/:type' render={({match}) => {
              let title = "";
              switch(match.params.type) {
                case 'highlighted':
                  title = "Highlights"
                  break;
                case 'popular':
                  title = "Popular";
                  break;
              }
              return <TrayRecordsIndex type={match.params.type} title={title} />
            }} />

            <Route exact path='/map/collections/:id' component={TrayCollection} />
            <Route exact path='/map/teams/:id' component={TrayTeamRecordsIndex} />
            <Route exact path='/map/users/:id' component={TrayUserRecordsIndex} />
          </Switch>
        </TrayContainer>
      </ErrorBoundary>

      {/* <Route component={RecordView} /> */}

      <Route render={({location}) => (
        <ErrorBoundary>
          <RecordView>
            <RecordViewReport />
          </RecordView>
        </ErrorBoundary>
      )} />

      <MediaView>
        <TransitionGroup>
          <CSSTransition timeout={100} classNames={'media-item'} key={location.key} >
            <Route component={MediaItem} />
          </CSSTransition>
        </TransitionGroup>
      </MediaView>

        <Route path='/map' render={() => (<ErrorBoundary><MapView/></ErrorBoundary>)} />

        {/* Various Overlays ... */}
        <Route component={SearchView} />
        <Route component={LayersOverlay} />
        <Route component={LayerDetailsOverlay} />
        <Route component={UserForm} />

        {/* the route we go to when '+ Add record' is clicked to allow the user to choose a place */}
        <Route component={PlacePicker} />

        {/* once the user has chosen a place on the map, we show the form */}
        <Route component={RecordForm} />

        {/* create/edit a collectiomn */}
        <Route component={CollectionForm} />

        {/* view a record */}
        {/* <Route exact path='/map/records/:id' component={RecordView} /> */}
        <Route exact path='/map/records/:id/report' render={({match, location}) => (
          <ErrorBoundary>
            <RecordView match={match}>
              <ErrorBoundary>
                <RecordViewReport />
              </ErrorBoundary>
            </RecordView>
          </ErrorBoundary>
        )} />

      <Route exact path='/map/collections/:collection_id/records/:id/report' render={({match, location}) => (
          <ErrorBoundary>
            <RecordView match={match}>
              <ErrorBoundary>
                <RecordViewReport />
              </ErrorBoundary>
            </RecordView>
          </ErrorBoundary>
      )} />

        <Route exact path='/map/records/:id/add-to-collection' render={({match, location}) => (
          <ErrorBoundary>
            <RecordView>
              <ErrorBoundary>
                <AddToCollection match={match}/>
              </ErrorBoundary>
            </RecordView>
          </ErrorBoundary>
        )} />

        {/* fixme: dry this route up later*/}
        <Route exact={true} path='/map/collections/:collection_id/records/:id/media/:media_item_id' render={( {match, location} ) => (
          <RecordView>
            <MediaView>
              <TransitionGroup>
                <CSSTransition timeout={100} classNames={'media-item'} key={location.key} >
                  <Route exact={true} path='/map/collections/:collection_id/records/:id/media/:media_item_id' component={MediaItem} />
                </CSSTransition>
              </TransitionGroup>
            </MediaView>
          </RecordView>
        )} />

        {/* view a collection */}
        {/* <Route exact path='/map/collections/:id' component={CollectionView} /> */}

        {/* view a team */}
        <Route exact path='/map/teams/:id' component={TeamView} />

        {/*View records for a user*/}
        <Route exact path='/map/users/:id' component={UserView} />

        {/* view a record within a collection */}
        <Route exact path='/map/collections/:collection_id/records/:id' component={RecordView} />

        <Route exact path='/map/not-found' component={NotFound} />
    </div>
  }
}
