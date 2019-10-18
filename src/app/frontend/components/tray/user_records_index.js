import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import CollectionCard from '../collection_card';

@inject('trayViewStore')
@observer
export default class TrayUserRecordsIndex extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    
    this.props.trayViewStore.fetchData({user_id: this.props.match.params.id});
  }

  render() {
    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      const key = `${result.is_collection ? 'collection' : 'record'}_${result.id}`;

      if(result.is_collection) {
        return <CollectionCard key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }else {
        return <Card key={key} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
      }
    });
    
    return <div>
      <Link style={{float: 'right'}} to='/map'>&times; close</Link>

      {
        this.props.trayViewStore.mainResults.size>0 && 
        <React.Fragment>
          <h1>{this.props.title}</h1>
          {mainResults}
        </React.Fragment>
      }
      
    </div>
  }
}
