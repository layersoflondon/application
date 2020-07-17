import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Card from '../card';
import CollectionCard from '../collection_card';
import TrayHeader from '../tray_header';

@inject('trayViewStore', 'mapViewStore')
@observer
export default class TrayRecordsIndex extends Component {
  constructor(props) {
    super(props);
    this.props.trayViewStore.showHighlightedResuts = false;

    if (this.props.type === "geobounded") {
      this.props.mapViewStore.getMapBounds().then((bounds) => {
        this.props.trayViewStore.reloadTrayDataForBounds(bounds);
      });
    } else {
      this.props.trayViewStore.fetchData({type: this.props.type}, {lockTray: true});
    }
  }

  componentDidMount() {
    if (!this.props.trayViewStore.locked) {
      this.props.mapViewStore.panTo(this.props.lat,this.props.lng,this.props.zoom)
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
      const key = `${result.is_collection ? 'collection_' : ''}${result.id}`;

      if (result.is_collection) {
        return <CollectionCard key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore}/>
      } else {
        return <Card key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore}/>
      }
    });

    let header;

    const closeOnClickHandler = () => {
      this.props.trayViewStore.goBackTo = null;
      this.props.trayViewStore.trayLocked = false;
    };

    const typeTitle = () => {
      const title = this.props.type;
      return `${title.charAt(0).toUpperCase()}${title.slice(1)}`;
    };

    if (this.props.type !== "geobounded") {
      header = <TrayHeader 
        title={typeTitle()}
        metaData={`${this.props.type} records and collections`}
        metaDescription={`${this.props.type} records and collections`}
        closePath={`/map`}
        closeOnClick={closeOnClickHandler}
      />;
    }

    return <React.Fragment>
      {header}
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
