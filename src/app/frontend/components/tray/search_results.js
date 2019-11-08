import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import Card from '../card';
import queryString from 'query-string';
import pluralize from 'pluralize';
import {getQueryStringParam} from '../../helpers/modals';
import TrayHeader from '../tray_header';

@inject('router', 'trayViewStore', 'mapViewStore', 'tagGroupsStore')
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
    
    const query = getQueryStringParam(this.props.router.location, 'q');
    const trayHeaderTitle = query ? `Your search results for “${getQueryStringParam(this.props.router.location, 'q')}“` : "Your search results";
    const filterTags = getQueryStringParam(this.props.router.location, 'tag_ids').split(',')
    const filterTagsCount = filterTags.length
    const recordMeta = pluralize('record', recordCount, true);

    let collectionMeta;
    if(collectionCount>0) {
      collectionMeta = pluralize('collection', collectionCount, true);
    }

    let metaDataString = '';

    if(!this.props.trayViewStore.loading) {
      metaDataString = `${[recordMeta, collectionMeta].filter((m) => m).join(' and ')} search results`;
    }

    return <React.Fragment>
      <TrayHeader 
        title={trayHeaderTitle}
        metaDescription={`Search results for ${getQueryStringParam(this.props.router.location, 'q')}`}
        metaData={metaDataString}
        // subtitle={`tags`} TODO: Tag name/count
        closePath={`/map`}
        closeOnClick={() => this.props.trayViewStore.trayLocked = false}
      />

      <div className="m-tray-records-list">
        {mainResults}
      </div>
    </React.Fragment>
  }
}
