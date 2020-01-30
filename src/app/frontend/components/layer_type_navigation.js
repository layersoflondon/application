import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import LayerType from './layer_type';
import SingletonUIViewStore from "../stores/singleton_ui_view_store";

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
@withRouter
@observer export default class LayerTypeNavigation extends Component {

  render() {
    const menuViewStore = new SingletonUIViewStore();

    return <div className="section-navigation">
      <h3>Showing:</h3>
      <LayerType singletonUiViewStore={menuViewStore} name="All" types={[]} />
      <LayerType singletonUiViewStore={menuViewStore} name="London maps" types={["Camden", "Greenwich", "Hackney", "Hammersmith and Fulham", "Islington", "Royal Borough of Kensington and Chelsea", "Lambeth", "Lewisham", "Southwark"]} />
      <LayerType singletonUiViewStore={menuViewStore} name="Borough maps" types={['Borough 1', 'Borough 2', 'Borough 3']} />
      <LayerType singletonUiViewStore={menuViewStore} name="Datasets" types={['Dataset 1', 'dataset 2', 'dataset 3']} />
    </div>;
  }
}
