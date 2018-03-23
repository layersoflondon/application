import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  switchToPreviousCardStore() {
    this.props.trayViewStore.cardStore = this.props.trayViewStore.previousCardStore;
  }

  render() {
    const cards = this.props.trayViewStore.cardStore.cards.map( (c) => {return <Card key={c.id} card={c} trayViewStore={this.props.trayViewStore} />});

    let trayClassName = "m-tray-area";

    let trayDetails = "";
    if(this.props.trayViewStore.previousCardStore) {
      trayDetails = <p onClick={this.switchToPreviousCardStore.bind(this)}>
        Previously showing a store with {this.props.trayViewStore.previousCardStore.cards.length} cards.
      </p>
    }

    return <div className={trayClassName} id="tray-container">
      <div className="open-close">
        <span>Close</span>
      </div>

      <div className="window">
        {trayDetails}

        <div className="s-tray-area--introduction is-showing">
          {cards}
        </div>
      </div>
    </div>;
  }
}

// Tray.propTypes = {
//   cardStore: PropTypes.object.isRequired
// };