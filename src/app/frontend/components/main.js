import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './tools';
import Tray from './tray';
import MapView from './map_view';
import Search from './search';

import CollectionForm from './forms/collections/collection_form';
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
      <RecordForm mapViewStore={this.props.mapViewStore} recordFormStore={this.recordFormStore} />

      <Tools mapViewStore={this.props.mapViewStore} />

      <MapView trayViewStore={this.props.trayViewStore} />
      <Tray trayViewStore={this.props.trayViewStore} />
    </div>
  }
}

Main.propTypes = {
  trayViewStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};
