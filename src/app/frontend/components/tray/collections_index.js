import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TrayCollectionsIndex extends Component {
  constructor(props) {
    super(props);
    this.props.trayViewStore.fetchCollections();
  }

  render() {
    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    return <React.Fragment>
      <div className="m-tray-title-area">
        <Link style={{float: 'right'}} to='/map'>&times; close</Link>
        <h1>
          Results for your collection search
        </h1>
        {
          !this.props.trayViewStore.loading && 
          <div className="meta">
            Search, {this.props.trayViewStore.mainResults.size} collections
          </div>
        }
      </div>
      
      <div className="m-tray-records-list">
        {
          this.props.trayViewStore.mainResults.size>0 && 
          <React.Fragment>
            <h1>{this.props.title}</h1>
            {mainResults}
          </React.Fragment>
        }
      </div>
      
    </React.Fragment>
  }
}
