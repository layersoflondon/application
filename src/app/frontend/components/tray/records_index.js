import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import CollectionCard from '../collection_card';

@inject('trayViewStore', 'mapViewStore')
@observer
export default class TrayRecordsIndex extends Component {
  constructor(props) {
    super(props);

    if (this.props.type === "geobounded") {
      this.props.mapViewStore.getMapBounds().then((bounds) => {
        this.props.trayViewStore.reloadTrayDataForBounds(bounds);
      });
    } else {
      this.props.trayViewStore.fetchData({type: this.props.type}, {lockTray: true});
    }
  }

  componentDidUpdate(oldProps) {
    const geobounded = this.props.type === "geobounded";
    const lat = this.props.lat;
    const lng = this.props.lng;

    if(geobounded && (lat !== oldProps.lat || lng !== oldProps.lng)) {
      this.props.mapViewStore.getMapBounds().then((bounds) => {
        this.props.trayViewStore.reloadTrayDataForBounds(bounds);
      });
    }
  }

  render() {
    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      const key = `${result.is_collection ? 'collection' : 'record'}_${result.id}`;

      if (result.is_collection) {
        return <CollectionCard key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore}/>
      } else {
        return <Card key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore}/>
      }
    });

    return <React.Fragment>
      <div className="m-tray-records-list">
        {
          this.props.trayViewStore.mainResults.size > 0 &&
          <React.Fragment>
            {mainResults}
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  }
}
