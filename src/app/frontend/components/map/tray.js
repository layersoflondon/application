import React,{Component} from 'react';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {cardStore} = this.props;
    const cards = cardStore.cards.map( (c) => {return <Card key={c.id} card={c} />});

    return <div className="m-tray-area" id="tray-container">
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
