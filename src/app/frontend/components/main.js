import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Devtools from 'mobx-react-devtools';
import {observer} from "mobx-react/index";

import Tools from './map/tools';
import Tray from './map/tray';
import LoLMap from './map/lol_map';

@observer class Main extends Component {
  render() {
    return <div id="main-container">
      <Devtools/>

      <Tools />

      <div id="map-container">
        <Tray cardStore={this.props.cardStore} />
        <LoLMap cardStore={this.props.cardStore} />
      </div>
    </div>
  }
}

Main.propTypes = {
  cardStore: PropTypes.object.isRequired,
  mapViewStore: PropTypes.object.isRequired
};

export default Main;
