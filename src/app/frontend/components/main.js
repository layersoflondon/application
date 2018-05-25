import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from "mobx-react";

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

@inject('routing', 'recordFormStore', 'trayViewStore', 'mapViewStore', 'collectionStore', 'layersStore')
@observer export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = "m-map-wrapper";
    if( !this.props.trayViewStore.tray_is_visible ) {
      className += " tray-is-closed";
    }

    return <div className={className}>
      <LayersOverlay {...this.props} />
      <Tools {...this.props} />
      <Tray {...this.props} />
      <MapView {...this.props} />

      <Search {...this.props} />
      <CollectionForm {...this.props} />
      <UserForm {...this.props} />
      <RecordForm {...this.props} />

      {this.props.trayViewStore.visible_record && <RecordView {...this.props} />}
      {this.props.mapViewStore.add_record_mode && <PlacePicker {...this.props} />}

    </div>
  }
}

// Main.propTypes = {
//   collectionStore: PropTypes.object.isRequired,
//   layersStore: PropTypes.object.isRequired,
//   mapViewStore: PropTypes.object.isRequired,
//   recordFormStore: PropTypes.object.isRequired,
//   recordStore: PropTypes.object.isRequired,
//   trayViewStore: PropTypes.object.isRequired
// };
