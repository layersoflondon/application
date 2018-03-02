import React,{Component} from 'react';

import Tools from './map/tools';
import Tray from './map/tray';
import Map from './map/lol_map';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div id="main-container">
      <Tools />

     <div id="map-container">
       <Tray />
       <Map />
     </div>
    </div>
  }
}

export default Main;
