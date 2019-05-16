import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import Slider from 'rc-slider';
import LayerTool from './layer_tool';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

  toggleLayerGroupVisibility() {
    this.props.layerGroup.toggleVisibility();
  }

  render() {
    let classes = 'layer';
    if(this.props.layerGroup.is_open) classes += ' is-open';
    if(this.props.layerGroup.layers.length>0) classes += ' has-components';

    return (
      <div className={classes}>
        <span className="name" onClick={()=>this.props.layerGroup.toggleIsOpen()}>{this.props.layerGroup.short_name || this.props.layerGroup.name}</span>
        <div className="view-controls">
          <span className="show-hide" onClick={this.toggleLayerGroupVisibility.bind(this)}>
          </span>
          <span className="slider">
            <Slider min={0} max={1} step={0.1} handle={handle} defaultValue={this.props.layerGroup.opacity} onChange={(value) => this.props.layerGroup.opacity = value} />
          </span>
        </div>

        <div className="layer-components" style={{ transform: "none" }}>
          <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
            <Droppable style={{ transform: "none" }} droppableId="droppable">
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
  }
}
