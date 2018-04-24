import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './tools';
import Tray from './tray';
import MapView from './map_view';
import Search from './search';
import RecordView from './record_view';
import PlacePicker from './place_picker';

import CollectionForm from './forms/collections/collection_form';
import UserForm from './forms/user/user_form';
import RecordForm from './forms/records/record_form';

import RecordFormStore from '../stores/record_form_store';

@observer export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  addCards(event) {
    const count = parseInt(event.target.dataset.add, 10);
    this.props.cardStore.addCards(count);
  }

  removeCard(){
    this.props.cardStore.removeCard();
  }

  componentWillMount() {
    this.recordFormStore = new RecordFormStore();
  }

  render() {
    return <div className="m-map-wrapper" id="main-container">
      <Devtools />

      <Search mapViewStore={this.props.mapViewStore} />
      <CollectionForm mapViewStore={this.props.mapViewStore} />
      <UserForm mapViewStore={this.props.mapViewStore} />
      <RecordForm mapViewStore={this.props.mapViewStore} recordFormStore={this.recordFormStore} />

      <Tools mapViewStore={this.props.mapViewStore} />

      {this.props.mapViewStore.visible_record_id && <RecordView {...this.props} record_id={this.props.mapViewStore.visible_record_id} />}

      <MapView trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} recordFormStore={this.recordFormStore} />
      <Tray trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />

      {this.props.mapViewStore.add_record_mode && <PlacePicker {...this.props} />}
    </div>
  }
}

Main.propTypes = {
  trayViewStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
