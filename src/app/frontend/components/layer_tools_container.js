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

    this.state = {is_open: false};
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
    this.state.is_open = (this.props.layersStore.active_layers.size) ? true : this.state.is_open;
    let classes = "m-layer-tools";
    if( !this.state.is_open ) {
      classes += " is-closed";
    }

    return <div className={classes}>

      <div className="panel">
        <button className="open" onClick={this.handleOnClick.bind(this)}>Layer tools</button>

        <div className="layers">
          {this.props.layersStore.activeLayers.values().map((l, index) => <span key={index}></span>)}

          <div>
            <div className="layer has-components is-open">

              <span className="name">Layer Alpha</span>
              <div class="view-controls">
                <span className="show-hide"></span>
                <span className="slider">
                  <div className="rc-slider">
                    <div className="rc-slider-rail"></div>
                    <div className="rc-slider-track"></div>
                    <div className="rc-slider-step"></div>
                    <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                    <div className="rc-slider-mark"></div>
                  </div>
                </span>
              </div>

              <div class="layer-components">
                <div class="layer-component">
                  <span className="key-symbol key-symbol--outline key-symbol--red"></span>
                  <span className="name">Parishes</span>
                  <div class="view-controls">
                    <span className="show-hide"></span>
                    <span className="slider">
                      <div className="rc-slider">
                        <div className="rc-slider-rail"></div>
                        <div className="rc-slider-track"></div>
                        <div className="rc-slider-step"></div>
                        <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                        <div className="rc-slider-mark"></div>
                      </div>
                    </span>
                  </div>
                 </div>
                <div class="layer-component">
                  <span className="key-symbol key-symbol--outline key-symbol--green"></span>
                  <span className="name">Map image</span>
                  <div class="view-controls">
                    <span className="show-hide"></span>
                    <span className="slider">
                      <div className="rc-slider">
                        <div className="rc-slider-rail"></div>
                        <div className="rc-slider-track"></div>
                        <div className="rc-slider-step"></div>
                        <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                        <div className="rc-slider-mark"></div>
                      </div>
                    </span>
                  </div>
                </div>
                <div class="layer-component is-hidden">
                  <span className="key-symbol key-symbol--outline key-symbol--orange"></span>
                  <span className="name">Street network</span>
                  <div class="view-controls">
                    <span className="show-hide"></span>
                    <span className="slider">
                      <div className="rc-slider">
                        <div className="rc-slider-rail"></div>
                        <div className="rc-slider-track"></div>
                        <div className="rc-slider-step"></div>
                        <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                        <div className="rc-slider-mark"></div>
                      </div>
                    </span>
                  </div>
                </div>

              </div>

            </div>

            <div className="layer">
              <span className="name">Layer Beta</span>
                <div class="view-controls">
                    <span className="show-hide"></span>
                    <span className="slider">
                      <div className="rc-slider">
                        <div className="rc-slider-rail"></div>
                        <div className="rc-slider-track"></div>
                        <div className="rc-slider-step"></div>
                        <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                        <div className="rc-slider-mark"></div>
                      </div>
                    </span>
                </div>
            </div>

            <div className="layer">
              <span className="name">Layer Gamma</span>
                <div class="view-controls">
                    <span className="show-hide"></span>
                    <span className="slider">
                      <div className="rc-slider">
                        <div className="rc-slider-rail"></div>
                        <div className="rc-slider-track"></div>
                        <div className="rc-slider-step"></div>
                        <div role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false" className="rc-slider-handle"></div>
                        <div className="rc-slider-mark"></div>
                      </div>
                    </span>
                </div>
            </div>

          </div>

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
