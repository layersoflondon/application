import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';

import Card from './card';
import {inject} from "mobx-react/index";

@inject('routing')
@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  switchToPreviousCardStore() {
    console.log(this.props.trayViewStore.card_store, this.props.trayViewStore.previous_card_store);
    this.props.trayViewStore.card_store = this.props.trayViewStore.previous_card_store;
    const { push, goBack } = this.props.routing;

    this.props.trayViewStore.visible_collection_id = null;

    // if( this.props.trayViewStore.collectionCard ) {
    //   this.props.trayViewStore.collectionCard.highlighted = false;
    // }

    push("/map");
  }

  render() {
    // if we dont have a trayViewStore with cards to render, show some info
    if(!(this.props.trayViewStore && this.props.trayViewStore.card_store)) {
      return (
        <div className="m-tray-area">
          <div className="window">
            <div className="s-tray-area--default is-showing">
              <div className="m-tray-title-area">
                <h1>No data to display</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const cards = this.props.trayViewStore.card_store.cards.map( (c) => {
      const key = `${c.is_collection ? 'collection' : 'record'}_${c.id}`;
      return <Card key={key} card={c} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });

    let trayClassName = "m-tray-area";
    if( !this.props.trayViewStore.tray_is_visible ) {
      trayClassName += " is-closed";
    }

    let trayCollectionDetails;
    if(this.props.trayViewStore.previous_card_store && !this.props.trayViewStore.card_store.root_card_store) {
      trayCollectionDetails = <div>
        <div className="m-tray-title-area">
          <div className="close" onClick={this.switchToPreviousCardStore.bind(this)}>
            <button className="close">Close</button>
          </div>
          <h1>{this.props.trayViewStore.card_store.title}</h1>
          <div className="meta">Collection, {this.props.trayViewStore.card_store.cards.length} records</div>
        </div>

        <div className="m-tray-introduction">
          {Parser(this.props.trayViewStore.card_store.description)}
        </div>
      </div>
    }

    return <div className={trayClassName}>
      <div className="open-close" onClick={() => this.props.trayViewStore.toggleTrayVisibility()}>
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
