import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import {setCurrentModal} from '../../helpers/modals';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TrayCollection extends Component {
  constructor(props) {
    super(props);
    this.props.trayViewStore.fetchCollection(this.props.match.params.id);
  }

  componentDidMount() {
    const search = setCurrentModal(this.props.router.location, 'record', undefined);
    const path = [this.props.router.location.pathname, search].filter((v)=>v).join('?');
    this.props.mapViewStore.previousLocation = path;
  }

  componentWillUnmount() {
    this.props.mapViewStore.previousLocation = null;
  }

  render() {
    if(this.props.trayViewStore.loading) return <React.Fragment />

    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });
    
    const closePath = this.props.trayViewStore.goBackTo || '/map';

    return <React.Fragment>
      <div className="m-tray-title-area">
        <h1>
          {this.props.trayViewStore.collection.title}
        </h1>
        <Link className="close" style={{float: 'right'}} to={closePath} onClick={() => this.props.trayViewStore.goBackTo = null}>&times;</Link>

        <div className="meta">
        </div>
      </div>
{/* 
      {
        this.props.trayViewStore.collection && 
        <h1>
          {this.props.trayViewStore.collection.title}
        </h1>
      } */}
      
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
