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

    const handleFilterResetOnClick = (event) => {
      this.props.layersStore.setFilters({term_id: null, category_id: null});
    };

    const isAllShowing = (!!!this.props.layersStore.searchFiltersPresent);

    return <div className="section-navigation">
      <h3>Showing:</h3>

      {
        this.props.categories.map((category) => <LayerType key={`category-${category.id}`} singletonUiViewStore={menuViewStore} name={category.name} terms={category.layer_terms} id={category.id} />)
      }

      <ul>
        <li className={isAllShowing ? 'is-current' : ''}>
          <a href="#" data-term-id={null} data-category-id={null} onClick={handleFilterResetOnClick}>All</a>
        </li>
      </ul>

    </div>;
  }
}
