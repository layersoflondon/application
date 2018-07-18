import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
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

@inject('layersStore')
@withRouter
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

      <div className="panel">
        <button className="open" onClick={this.handleOnClick.bind(this)}>Layer tools</button>

        <div className="layers">
          {this.props.layersStore.activeLayers.values().map((l, index) => <span key={index}></span>)}

          <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {this.props.layersStore.activeLayers.values().map((l, index) => {
                    return (
                      <Draggable key={l.id} draggableId={l.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided. draggableProps.style)}>
                            <LayerTool key={l.id} layer={l} {...this.props} index={index} />
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Link to="/map/layers">Choose new layers</Link>
        </div>

      </div>
    </div>
  }
}
