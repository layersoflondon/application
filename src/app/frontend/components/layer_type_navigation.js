import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import LayerType from './layer_type';
import SingletonUIViewStore from "../stores/singleton_ui_view_store";
import axios from 'axios';

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
@withRouter
@observer export default class LayerTypeNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!this.props.categories || !this.props.categories.length) return <React.Fragment />;

    const menuViewStore = new SingletonUIViewStore();

    return <div className="section-navigation">
      <h3>Showing:</h3>
      <ul>
        <li>
          <a href="#" data-term-id="" onClick={this.props.filterCallback}>All</a>
        </li>
      </ul>

      {this.props.categories.map((category) => <LayerType key={`category-${category.id}`} filterCallback={this.props.filterCallback} singletonUiViewStore={menuViewStore} name={category.name} terms={category.layer_terms} />)}
    </div>;
  }
}
