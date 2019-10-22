import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import CollectionCard from '../collection_card';
import TrayTags from './tags';

@inject('trayViewStore', 'mapViewStore')
@observer export default class GettingStartedTray extends Component {
  constructor(props) {
    super(props);

    this.props.trayViewStore.fetchGettingStartedData();
  }

  render() {
    const highlightedResults = this.props.trayViewStore.highlightedResults.values().map((result) => {
      const key = `${result.is_collection ? 'collection' : 'record'}_${result.id}`;
      
      if(result.is_collection) {
        return <CollectionCard key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }else {
        return <Card key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }
    });

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      const key = `${result.is_collection ? 'collection' : 'record'}_${result.id}`;

      if(result.is_collection) {
        return <CollectionCard key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }else {
        return <Card key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }
    });

    return <div className="m-tray-records-container">
      {
        this.props.trayViewStore.highlightedResults.size>0 && 
        <div className="records-section">
          <div className="m-tray-title-area">
            <h1>Highlighted</h1>
            <div className="meta"><Link to='/map/highlighted'>More</Link></div>
          </div>

          <div className="m-tray-records-list">
            {highlightedResults}
          </div>
        </div>
      }

      {
        this.props.trayViewStore.mainResults.size>0 && 
        <div className="records-section">
          <div className="m-tray-title-area">
            <h1>Popular</h1>
            <div className="meta"><Link to='/map/popular'>More</Link></div>
          </div>

          <div className="m-tray-records-list">
            {mainResults}
          </div>
        </div>
      }

      {
        !this.props.trayViewStore.loading && 
        <div className="records-section">
          <div className="m-tray-title-area">
            <h1>Search by tag</h1>
          </div>
          <div className="m-tag-groups">
            <TrayTags />
          </div>
        </div>
      }
    </div>
  }
}
