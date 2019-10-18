import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import Card from '../card';
import pluralize from 'pluralize';
import TrayHeader from '../tray_header';

@inject('trayViewStore')
@observer
export default class TrayUserRecordsIndex extends Component {
  constructor(props) {
    super(props);
    
    this.props.trayViewStore.fetchData({user_id: this.props.match.params.id}, {headers: ['x-user-name']});
  }

  render() {
    if(this.props.trayViewStore.loading) return <React.Fragment />

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    return <React.Fragment>
      <TrayHeader 
        title={""}
        // subtitle={this.props.trayViewStore.collection.title} 
        introduction={`Records created by `}
        metaDescription={`View records by `}
        metaData={`User,${pluralize('record', this.props.trayViewStore.mainResults.size, true)}`} 
        closePath={`/map`}
      />
      
      <div className="m-tray-records-list">
        {
          this.props.trayViewStore.mainResults.size>0 && 
          <React.Fragment>
            {mainResults}
          </React.Fragment>
        }
      </div>      
    </React.Fragment>
  }
}
