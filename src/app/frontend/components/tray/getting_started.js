import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import CollectionCard from '../collection_card';

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

    return <div>
      {
        this.props.trayViewStore.highlightedResults.size>0 && 
        <React.Fragment>
          <h1>Highlighted - <Link to='/map/highlighted'>More</Link></h1>
          {highlightedResults}
        </React.Fragment>
      }

      {
        this.props.trayViewStore.mainResults.size>0 && 
        <React.Fragment>
          <h1>Popular - <Link to='/map/popular'>More</Link></h1>
          {mainResults}
        </React.Fragment>
      }
    </div>
  }
}
