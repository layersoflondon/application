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
    
    this.user = null;
    this.fetchRecords();
  }

  componentDidUpdate(newProps) {
    if(newProps.match.params.id !== this.props.match.params.id) {
      this.fetchRecords();
    }
  }

  fetchRecords() {
    this.state = {loading: true};
    User.show(null, this.props.match.params.id).then((response) => {
      this.user = response.data;
      this.props.trayViewStore.fetchData({user_id: this.props.match.params.id});
    }).finally(() => {
      this.loading = false;
      this.setState({loading: false});
    });
  }

  render() {
    if(this.props.trayViewStore.loading || this.state.loading) return <React.Fragment />

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    return <React.Fragment>
      <TrayHeader 
        title={this.user.name}
        // subtitle={this.props.trayViewStore.collection.title} 
        introduction={this.user.description}
        metaDescription={`View records by ${this.user.name}`}
        metaData={`User, ${pluralize('record', this.props.trayViewStore.mainResults.size, true)}`} 
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
