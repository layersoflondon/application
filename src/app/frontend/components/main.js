import React,{Component} from 'react';

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
        <Tray />
        <LoLMap />
      </div>
    </div>
  }
}

export default Main;
