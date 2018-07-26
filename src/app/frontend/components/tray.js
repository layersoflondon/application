import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {NavLink, withRouter} from 'react-router-dom';
import Parser from 'html-react-parser';

import Card from './card';
import {inject} from "mobx-react/index";

@inject('router', 'trayViewStore', 'mapViewStore')
@observer export default class Tray extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.router.history.location.pathname === "/map") {
      setTimeout(() => {
        this.props.trayViewStore.reloadTrayDataForBounds(this.props.mapViewStore.current_bounds);
      }, 2);
    }
  }

  componentWillReceiveProps() {
    if (this.props.router.history.location.pathname === "/map" && !this.props.trayViewStore.root ) {
      this.props.trayViewStore.restoreRootState();
    }
  }

  render() {
    const cards = this.props.trayViewStore.cards.values().map( (c) => {
      const key = `${c.is_collection ? 'collection' : 'record'}_${c.id}`;
      return <Card key={key} card={c} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} />
    });

    let trayClassName = "m-tray-area";
    if( !this.props.trayViewStore.tray_is_visible ) {
      trayClassName += " is-closed";
    }

    if( this.props.trayViewStore.loading ) {
      trayClassName = "m-tray-area is-loading";
    }

    let trayCollectionDetails;

    if(!this.props.trayViewStore.root) {
      trayCollectionDetails = <div>
        <div className="m-tray-title-area">
          <div className="close">
            <NavLink to="/map" className="close">Close</NavLink>
          </div>

          <h1>{this.props.trayViewStore.title}</h1>
          <div className="meta">Showing {this.props.trayViewStore.cards.size} records</div>
        </div>

        <div className="m-tray-introduction">
          {this.props.trayViewStore.description}
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
