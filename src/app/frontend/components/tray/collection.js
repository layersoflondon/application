import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import Card from '../card';
import {setCurrentModal} from '../../helpers/modals';
import TrayHeader from '../tray_header';
import pluralize from "pluralize";

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TrayCollection extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const search = setCurrentModal(this.props.router.location, 'record', undefined);
    const path = [this.props.router.location.pathname, search].filter((v)=>v).join('?');
    this.props.mapViewStore.previousLocation = path;

    this.props.trayViewStore.fetchCollection(this.props.match.params.id);
  }

  componentDidUpdate(oldProps) {
    if(oldProps.match.params.id !== this.props.match.params.id) {
      this.props.trayViewStore.fetchCollection(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.mapViewStore.previousLocation = null;
  }

  render() {
    if(!this.props.trayViewStore.collection || this.props.trayViewStore.loading) return <React.Fragment />

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    const closePath = this.props.trayViewStore.goBackTo || '/map';

    return <React.Fragment>
      <TrayHeader 
        title={this.props.trayViewStore.collection.title} 
        // subtitle={this.props.trayViewStore.collection.title} 
        introduction={this.props.trayViewStore.collection.description}
        metaDescription={`View records in the collection ${this.props.trayViewStore.collection.title}`}
        metaData={`Collection, ${pluralize('record', this.props.trayViewStore.collection.records.length, true)}`} 
        closePath={closePath}
        closeOnClick={() => this.props.trayViewStore.goBackTo = null}
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
