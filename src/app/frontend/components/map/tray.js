import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cards = this.props.mapViewStore.currentCardStore.cards.map( (c) => {return <Card key={c.id} card={c} mapViewStore={this.props.mapViewStore} />});

    console.log(`Rendering Tray ${mapViewStore.currentCardStore.cards.length} cards`);

    let trayClassName = "m-tray-area";

    return <div className={trayClassName} id="tray-container">
      <div className="open-close">
        <span>Close</span>
      </div>

      <div className="window">
        <div className="s-tray-area--introduction is-showing">
          {cards}
        </div>
      </div>
    </div>;
  }
}

Tray.propTypes = {
  mapViewStore: PropTypes.object.isRequired
};