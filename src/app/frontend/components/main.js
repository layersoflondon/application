import React,{Component} from 'react';
import PropTypes from 'prop-types';


import {observer} from "mobx-react";

import Tools from './tools';
import Tray from './tray';
import MapView from './map_view';
import Search from './search';
import RecordView from './record_view';
import PlacePicker from './place_picker';
import LayersOverlay from './layers_overlay';

import CollectionForm from './forms/collections/collection_form';
import UserForm from './forms/user/user_form';
import RecordForm from './forms/records/record_form';

import DevTools from 'mobx-react-devtools';

@observer export default class Main extends Component {
  constructor(props) {
    super(props);
    console.log("Required props: ", props);
  }

  render() {
    return <div className="m-map-wrapper">
      <DevTools position={{bottom: 20, right: 0}} />

      <Tools {...this.props} />
      <Tray {...this.props} />
      <MapView {...this.props} />

      <Search {...this.props} />
      <LayersOverlay {...this.props} />
      <CollectionForm {...this.props} />
      <UserForm mapViewStore={this.props.mapViewStore} />
      <RecordForm {...this.props} />

      {this.props.trayViewStore.visible_record && <RecordView {...this.props} />}
      {this.props.mapViewStore.add_record_mode && <PlacePicker {...this.props} />}

    </div>
  }
}

Main.propTypes = {
  trayViewStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
