import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from "mobx-react";

@inject('trayViewStore', 'mapViewStore')
@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.mapViewStore.add_record_mode = true;
    this.props.trayViewStore.locked = true;

    if( this.props.trayViewStore.tray_is_visible ) {
      this.props.trayViewStore.toggleTrayVisibility();

      setTimeout(() => {
        this.props.mapViewStore.map_ref.leafletElement.invalidateSize();
      }, 250);
    }
  }

  handleOnClick(event) {
    //fixme: wire this component up to google maps
    console.log("TODO Search and pan the map...", console.log(this.props));
  }

  render() {
    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Click on the map to choose where to add your record
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
