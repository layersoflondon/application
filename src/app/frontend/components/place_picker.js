import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from "mobx-react";

@inject('trayViewStore', 'mapViewStore', 'router')
@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if( this.props.trayViewStore.cards.size === 0 && !this.props.trayViewStore.locked ) {
      setTimeout(() => {
        this.props.trayViewStore.restoreRootState();
      }, 10);
    }
  }

  componentDidMount() {
    this.props.mapViewStore.add_record_mode = true;
    this.props.trayViewStore.locked = true;

    if( this.props.trayViewStore.tray_is_visible ) {
      this.props.trayViewStore.toggleTrayVisibility();
    }
  }

  handleCancelOnClick(event) {
    event.preventDefault();

    this.props.mapViewStore.add_record_mode = false;
    this.props.trayViewStore.toggleTrayVisibility();
    this.props.router.goBack();
  }

  render() {
    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Click on the map to choose where to add your record <a href="" className='close' onClick={this.handleCancelOnClick.bind(this)}></a>
          {/*Pick a place to add a record or*/}
          {/*<input placeholder="Search" type="text" />*/}
          {/*<button onClick={this.handleOnClick.bind(this)}>Search</button>*/}
        </div>
      </div>
    );
  }
}

PlacePicker.propTypes = {
};
