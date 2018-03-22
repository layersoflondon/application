import React,{Component} from 'react';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {cardStore, mapViewStore} = this.props;
    const cards = mapViewStore.currentCardStore.cards.map( (c) => {return <Card key={c.id} card={c} cardStore={this.props.cardStore} mapViewStore={this.props.mapViewStore} />});

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
