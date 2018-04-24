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
    // console.log(this.props.trayViewStore.cardStore, this.props.trayViewStore.cardStore.cards.toJS());

    const cards = this.props.trayViewStore.cardStore.cards.map( (c) => {
      const key = `${c.is_collection ? 'collection' : 'record'}_${c.id}`;
      return <Card key={key} card={c} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });

    let trayClassName = "m-tray-area";

    let trayCollectionDetails;
    if(this.props.trayViewStore.previousCardStore && !this.props.trayViewStore.cardStore.rootCardStore) {
      trayCollectionDetails = <div>
        <div className="m-tray-title-area">
          <div className="close" onClick={this.switchToPreviousCardStore.bind(this)}>
            <button className="close">Close</button>
          </div>
          <h1>{this.props.trayViewStore.cardStore.title}</h1>
          <div className="meta">Collection, {this.props.trayViewStore.cardStore.cards.length} records</div>

          {/*<div className="creator-link"><a href="#">Mrs Clark's History Class</a></div>*/}
        </div>

        <div className="m-tray-introduction">
          <p>
            {this.props.trayViewStore.cardStore.description}
          </p>
        </div>
      </div>
    }

    return <div className={trayClassName}>
      <div className="open-close">
        <span>Close</span>
      </div>

      <div className="window">
        <div className="s-tray-area--default is-showing">
          {trayCollectionDetails}

          <div className="m-tray-records-list">
            {cards}
          </div>

        </div>
      </div>
    </div>;
  }
}
