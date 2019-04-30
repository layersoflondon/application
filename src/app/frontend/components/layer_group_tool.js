import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import Slider from 'rc-slider';
import LayerTool from './layer_tool';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  width: '100%',
});

const reorder = (items, startIndex, endIndex) => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const handle = (props) => {
  const {value, dragging, index, ...otherProps} = props;
  return <Slider.Handle value={value} {...otherProps} />;
};

@inject('layersStore')
@observer export default class LayerGroupTool extends Component {
  handleLoupeToolClick(event) {
    event.preventDefault();

    if( this.props.layersStore.loupe_layer_id === this.props.layer.id ) {
      this.props.layersStore.loupe_layer_id = null;
    }else {
      this.props.layersStore.loupe_layer_id = this.props.layer.id;
    }
  }

  toggleLoupeTool() {
    if( this.props.index === 0 ) return false;

    const options = {};

    if( this.props.layersStore.loupe_layer_id === this.props.layer.id ) {
      options.label = "Off";
    }else {
      options.label = "Loupe";
    }

    return options;
  }

  onDragEnd(result) {
    if( !result.destination ) {
      return;
    }

    const list = Array.from(this.props.layerGroup.layers);
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);

    this.props.layerGroup.layers = list;
  }

  render() {
    let classes = 'layer';
    if(this.props.layerGroup.is_open) classes += ' is-open';
    if(this.props.layerGroup.layers.length>0) classes += ' has-components';

    return (
      <div className={classes}>
        <span className="name" onClick={()=>this.props.layerGroup.toggleIsOpen()}>{this.props.layerGroup.name}</span>
        <div className="view-controls">
        <span className="show-hide">
        </span>
          <span className="slider">
          <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layerGroup.opacity} onChange={(value) => this.props.layerGroup.opacity = value} />
        </span>
        </div>

        <div className="layer-components">
          <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {this.props.layerGroup.layers.map((layer, index) => (
                        <Draggable key={layer.id} draggableId={layer.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                              <LayerTool key={layer.id} layer={layer} />
                            </div>
                          )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );

    // return <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
    //   <Droppable droppableId="droppable">
    //     {(provided, snapshot) => (
    //       <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
    //         {[1,2,3,4,5,6,7].map((item, index) => (
    //           <Draggable key={index} draggableId={item} index={index}>
    //             {(provided, snapshot) => (
    //               <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
    //                 {item}
    //               </div>
    //             )}
    //           </Draggable>
    //         ))}
    //         {provided.placeholder}
    //       </div>
    //     )}
    //   </Droppable>
    // </DragDropContext>;
  }
}
