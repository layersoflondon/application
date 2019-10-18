import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import queryString from 'query-string';
import pluralize from 'pluralize';
import {getQueryStringParam} from '../../helpers/modals';
import TrayHeader from '../tray_header';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TraySearchResults extends Component {
  constructor(props) {
    super(props);
    
    this.state = queryString.parse(this.props.router.location.search);
    this.props.trayViewStore.trayLocked = true;
    this.props.trayViewStore.fetchData(this.state);
  }

  render() {
    const recordCount = this.props.trayViewStore.mainResults.values().filter((r) => !r.is_collection).length;
    const collectionCount = this.props.trayViewStore.mainResults.values().filter((r) => r.is_collection).length;

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    return <React.Fragment>
      <TrayHeader 
        title={`Your search results for “${getQueryStringParam(this.props.router.location, 'q')}“`}
        // subtitle={this.props.trayViewStore.collection.title} 
        metaDescription={`Search results for ${getQueryStringParam(this.props.router.location, 'q')}`}
        metaData={`${pluralize('record', recordCount, true)} and ${pluralize('collection', collectionCount, true)} search results`} 
        closePath={`/map`}
        closeOnClick={() => this.props.trayViewStore.trayLocked = false}
      />

      <div className="m-tray-records-list">
        {mainResults}
      </div>
    </React.Fragment>
  }
}
