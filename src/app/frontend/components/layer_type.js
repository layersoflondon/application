import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

@inject('layersStore')
@observer export default class LayerType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selected: null
    };

    this.toggleRef = React.createRef();

    this.handleOnClick = (event) => {
      this.props.singletonUiViewStore.visibleSingletonComponent = this;
    };

    this.handleTermClick = (event) => {
      const termId = parseInt(event.target.dataset.termId, 10);
      
      if(this.props.layersStore.category_id === termId) {
        this.props.layersStore.category_id = null;
      }else {
        this.props.layersStore.category_id = termId
      }

      if(this.props.singletonUiViewStore.visibleSingletonComponent) {
        this.props.singletonUiViewStore.visibleSingletonComponent.setState({visible: false});
      }

      this.props.filterCallback(event);
    };
  }

  render() {
    const isSelected = (id) => this.props.layersStore.category_id === id ? 'is-current' : '';

    return <ul ref={this.toggleRef} onClick={this.handleOnClick}>
      <li>
        <a href="#">{this.props.name}</a>
        {this.state.visible &&
          <ul>
            {this.props.terms.map((type, i) => {
              return <li key={`layer-type-${type.id}`} className={isSelected(type.id)}>
                <a href="#" data-term-id={type.id} onClick={this.handleTermClick}>{type.name}</a>
              </li>
            })}
          </ul>
        }
      </li>
    </ul>;
  }
}
