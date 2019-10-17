import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from "mobx-react";

@inject('trayViewStore', 'mapViewStore', 'router')
@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if(!this.props.mapViewStore.inChoosePlaceMode) return;

    if( this.props.trayViewStore.cards.size === 0 && !this.props.trayViewStore.locked ) {
      setTimeout(() => {
        this.props.trayViewStore.restoreRootState();
      }, 10);
    }
  }

  handleCancelOnClick(event) {
    event.preventDefault();

    this.props.mapViewStore.setChoosePlaceMode(false);
  }

  render() {
    if(!this.props.mapViewStore.inChoosePlaceMode) return <React.Fragment />;
    
    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Choose the location of your record <a href="" className='close' onClick={this.handleCancelOnClick.bind(this)}></a>
        </div>
      </div>
    );
  }
}
