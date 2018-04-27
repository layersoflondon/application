import React,{Component} from 'react';
import {observer} from "mobx-react";
import LayerTool from './layer_tool';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (items, startIndex, endIndex) => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  width: '100%',
});

@observer export default class LayerToolsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {is_open: false}
  }

  handleOnClick(event) {
    this.setState({is_open: !this.state.is_open});
  }

  onDragEnd(result) {
    if( !result.destination ) {
      return;
    }

    const layers = reorder(this.props.layersStore.activeLayers, result.source.index, result.destination.index);
    this.props.layersStore.setLayers(layers);
  }

  render() {
    let classes = "m-layer-tools";
    if( !this.state.is_open ) {
      classes += " is-closed";
    }

    return <div className={classes}>
      <button onClick={this.handleOnClick.bind(this)}>Layer tools</button>

      <div className="panel">
        <h1>Layer tools</h1>
        <button onClick={this.handleOnClick.bind(this)}><span className="close"></span></button>

        {this.props.layersStore.activeLayers.map((l, index) => <span key={index}></span>)}

        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {this.props.layersStore.activeLayers.map((l, index) => {
                  return (
                    <Draggable key={l.id} draggableId={l.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided. draggableProps.style)}>
                          <LayerTool key={l.id} layer={l} {...this.props} />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <a onClick={()=>this.props.mapViewStore.overlay = "layers"}>Choose new layers</a>

      </div>
    </div>
  }
}
