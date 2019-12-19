import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Card from '../card';
import TrayHeader from '../tray_header';
import pluralize from 'pluralize';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TrayCollectionsIndex extends Component {
  constructor(props) {
    super(props);
    this.props.trayViewStore.fetchCollections();
  }

  render() {
    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore}/>
    });

    return <React.Fragment>

      <TrayHeader
        title="Results for your collection search"
        // subtitle={this.props.trayViewStore.collection.title} 
        metaDescription={`Collections index`}
        metaData={`Collection, ${pluralize('collection', this.props.trayViewStore.mainResults.size, true)}`}
        closePath={`/map`}
      />

      {
        this.props.title &&
        <div className="m-tray-subtitle-area">
          <h1>{this.props.title}</h1>
        </div>
      }

      {
        this.props.trayViewStore.mainResults.size > 0 &&
        <div className="m-tray-records-list">
          {mainResults}
        </div>
      }

    </React.Fragment>
  }
}
