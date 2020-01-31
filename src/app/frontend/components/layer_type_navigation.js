import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import LayerType from './layer_type';
import SingletonUIViewStore from "../stores/singleton_ui_view_store";

@inject('mapViewStore', 'layersStore', 'trayViewStore', 'router')
@withRouter
@observer export default class LayerTypeNavigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menuViewStore = new SingletonUIViewStore();

    const data = [
      {id: 1, name: "London Maps", items: [{id: 1, name: "Lambeth"}, {id: 1, name: "Lambeth"}, {id: 1, name: "Lambeth"}]},
      {id: 2, name: "Borough Names", items: [{id: 1, name: "Camden"}, {id: 1, name: "Camden"}, {id: 1, name: "Camden"}]},
      {id: 3, name: "Datasets", items: [{id: 1, name: "Dataset 1"}, {id: 1, name: "Dataset 1"}, {id: 1, name: "Dataset 1"}]}
    ];

    return <div className="section-navigation">
      <h3>Showing:</h3>
      {data.map((layerTypeData) => {
        return <LayerType key={`layer-type-data-${layerTypeData.id}`} singletonUIViewStore={menuViewStore} data={layerTypeData} onItemClickCallback={this.props.itemClickHandler} />
      })}
    </div>;
  }
}
