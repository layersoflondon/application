import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from "mobx-react";
import {closeModalLink} from '../helpers/modals';

@inject('trayViewStore', 'mapViewStore', 'router')
@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
  }
  
  handleCancelOnClick(event) {
    event.preventDefault();

    this.props.mapViewStore.inChoosePlaceMode = false;
  }

  render() {
    if(!this.props.mapViewStore.inChoosePlaceMode) return <React.Fragment />;
    
    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Choose the location of your record <Link to={closeModalLink(this.props.router.location, 'choose-place')} className='close' onClick={this.handleCancelOnClick.bind(this)}></Link>
        </div>
      </div>
    );
  }
}
