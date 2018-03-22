import React,{Component} from 'react';
import {observer} from "mobx-react";

import Card from './card';

@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
    this.state = {isShowing: true}
  }

  toggleTrayState() {
    this.setState({isShowing: ! this.state.isShowing});
  }

  render() {
    const {cardStore} = this.props;
    const cards = cardStore.cards.map( (c) => {return <Card key={c.id} card={c} />});

    let trayClassName = "m-tray-area";
    if( !this.state.isShowing ) {
      trayClassName += " is-closed";
    }

    return <div className={trayClassName} id="tray-container">
      <div className="open-close" onClick={this.toggleTrayState.bind(this)}>
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
