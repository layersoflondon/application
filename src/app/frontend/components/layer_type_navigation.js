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

    const handleFilterRestOnClick = (event) => {
      this.props.layersStore.term_id = null;
      this.props.layersStore.category_id = null;
    };

    const isAllShowing = (!!!this.props.layersStore.searchQueriesPresent);

    return <div className="section-navigation">
      <h3>Showing:</h3>
      <ul>
        <li className={isAllShowing ? 'is-current' : ''}>
          <a href="#" data-term-id={null} data-category-id={null} onClick={handleFilterRestOnClick}>All</a>
        </li>
      </ul>

      {
        this.props.categories.map((category) => <LayerType key={`category-${category.id}`} singletonUiViewStore={menuViewStore} name={category.name} terms={category.layer_terms} id={category.id} />)
      }
    </div>;
  }
}
