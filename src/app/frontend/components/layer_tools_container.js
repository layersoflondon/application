import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import LayerGroupTool from './layer_group_tool';

@inject('layersStore')
@withRouter
@observer export default class LayerToolsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {is_open: false};
  }

  handleOnClick(event) {
    this.setState({is_open: !this.state.is_open});
  }

  render() {
    this.state.is_open = (this.props.layersStore.active_layer_groups.size) ? true : this.state.is_open;
    let classes = "m-layer-tools";
    if( !this.state.is_open ) {
      classes += " is-closed";
    }

    return <div className={classes}>
      <div className="panel">
        <button className="open" onClick={this.handleOnClick.bind(this)}>Layer tools</button>

        <div className="layers">
          <div>
            {this.props.layersStore.activeLayerGroups.values().map((layerGroup) => <LayerGroupTool key={layerGroup.id} layerGroup={layerGroup} />)}
          </div>

          <Link to="/map/layers">Choose new layers</Link>
        </div>
      </div>
    </div>
  }
}
