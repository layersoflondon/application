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
    return <div className="m-map-wrapper">
      <Devtools />

      <Tools {...this.props} />
      <Tray {...this.props} />
      <MapView {...this.props} recordFormStore={this.recordFormStore} />

      <Search {...this.props} />
      <CollectionForm {...this.props} />
      <UserForm mapViewStore={this.props.mapViewStore} />
      <RecordForm {...this.props} recordFormStore={this.recordFormStore} />

      {this.props.trayViewStore.visible_record && <RecordView {...this.props} />}
      {this.props.mapViewStore.add_record_mode && <PlacePicker {...this.props} />}

    </div>
  }
}

Main.propTypes = {
  trayViewStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
