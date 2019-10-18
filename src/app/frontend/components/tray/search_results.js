import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import queryString from 'query-string';
import pluralize from 'pluralize';
import {getQueryStringParam} from '../../helpers/modals';

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
    const recordcount = this.props.trayViewStore.mainResults.values().filter((r) => !r.is_collection).length;
    const collectionCount = this.props.trayViewStore.mainResults.values().filter((r) => r.is_collection).length;

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    return <React.Fragment>
      <div className="m-tray-title-area">
        <Link style={{float: 'right'}} to='/map' onClick={() => this.props.trayViewStore.trayLocked = false}>&times;</Link>
        <h1>
          Your search results for “{getQueryStringParam(this.props.router.location, 'q')}“
        </h1>
        
        {
          !this.props.trayViewStore.loading && 
          <div className="meta">
            {pluralize('record', recordcount, true)} and {pluralize('collection', collectionCount, true)}
          </div>
        }
      </div>

      <div className="m-tray-records-list">
        {mainResults}
      </div>
    </React.Fragment>
  }
}
