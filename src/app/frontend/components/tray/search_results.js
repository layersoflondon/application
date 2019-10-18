import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import Card from '../card';
import queryString from 'query-string';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer
export default class TraySearchResults extends Component {
  constructor(props) {
    super(props);
    
    this.state = queryString.parse(this.props.router.location.search);
    this.props.trayViewStore.fetchData(this.state);
  }

  componentDidUpdate() {
    console.log("UPDATE");
  }

  render() {
    const mainResults = this.props.trayViewStore.mainResults.values().map((result) => {
      return <Card key={`record_${result.id}`} card={result} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
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
