import React,{Component} from 'react';
import {observer} from "mobx-react";

import Card from './card';
import {inject} from "mobx-react";
import ErrorBoundary from "./error_boundary";
import TrayHeader from "./tray_header";

import { Route } from 'react-router';

@inject('router', 'trayViewStore', 'mapViewStore')
@observer export default class TrayContainer extends Component {
  constructor(props) {
    super(props);

    this.props.trayViewStore.tray_list_ref = React.createRef();
  }
  
  render() {
    const cards = this.props.trayViewStore.cards.values().map( (c) => {
      const key = `${c.is_collection ? 'collection' : 'record'}_${c.id}`;
      return <ErrorBoundary key={key}><Card card={c} trayViewStore={this.props.trayViewStore} mapViewStore={this.props.mapViewStore} /></ErrorBoundary>
    });

    let trayClassName = "m-tray-area";
    if( !this.props.trayViewStore.tray_is_visible ) {
      trayClassName += " is-closed";
    }

    if( this.props.trayViewStore.loading ) {
      trayClassName = "m-tray-area is-loading";
    }
    
    return <div className={trayClassName}>
      <div className="open-close" onClick={() => this.props.trayViewStore.toggleTrayVisibility()}>
        <span>Close</span>
      </div>

      <div className="window" ref={this.props.trayViewStore.tray_list_ref}>
        <div className="s-tray-area--default is-showing">
          {/* <ErrorBoundary>
            <TrayHeader showTrayHeader={!this.props.trayViewStore.root} {...this.props}/>
          </ErrorBoundary> */}

          {this.props.children}
        </div>
      </div>
    </div>;
  }
}
