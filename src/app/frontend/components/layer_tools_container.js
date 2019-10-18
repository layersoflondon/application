import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import LayerGroupTool from './layer_group_tool';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {openModalLink} from '../helpers/modals';

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  userSelect: 'none',
  position: isDragging ? 'static' : 'relative',
  height: isDragging ? '0' : 'auto',
  display: 'block',
});

const getListStyle = isDraggingOver => ({
  width: '100%',
});

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

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

  onDragEnd(result) {
    if( !result.destination ) {
      return;
    }

    const list = this.props.layersStore.activeLayerGroups;
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);

    this.props.layersStore.layer_group_order = list;

  }

  render() {
    let classes = `m-layer-tools ${this.props.layersStore.activeVisibleLayerGroups.length}-layers`;
    if( !this.state.is_open ) {
      classes += " is-closed";
    }

    const lightsOutLabel = this.props.mapViewStore.lightsOut ? 'Show records' : 'Hide records';
    const lightsOutClasses = this.props.mapViewStore.lightsOut ? 'lights-out is-active' : 'lights-out';

    return <div className={classes} style={{ transform: "none" }}>
      <div className="panel">
        <button className="open" onClick={this.handleOnClick.bind(this)}>Layer tools</button>

        <div className="layers">
          <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <Droppable style={{ transform: "none" }} droppableId="droppable">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {this.props.layersStore.activeLayerGroups.map((layerGroup, index) => (
                    <Draggable key={layerGroup.id} draggableId={layerGroup.id} index={index} isDragDisabled={this.props.layersStore.activeLayerGroups.length===1}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                          <LayerGroupTool key={layerGroup.id} layerGroup={layerGroup} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Link className={lightsOutClasses} to="#" onClick={()=>this.props.mapViewStore.lightsOut = !this.props.mapViewStore.lightsOut}>{lightsOutLabel}</Link>

          <Link to={openModalLink(this.props.router.location, {key: 'layers', value: true})}>Choose new layers</Link>
        </div>
      </div>
    </div>
  }
}
