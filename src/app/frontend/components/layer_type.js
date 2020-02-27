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
      console.log("terms length", this.props.terms.length, "event", event);
      if (this.props.terms.length === 0) {
        const categoryId = parseInt(event.target.dataset.categoryId, 10);
        console.log('category id', categoryId, 'target', event.target, 'category id', event.target.dataset);

      //  need to actually filter the contents of the layers by the category ID, not term id.
        setTimeout(() => this.props.singletonUiViewStore.visibleSingletonComponent.setState({visible: false}), 50);
        this.props.layersStore.term_id = null;
        if(this.props.layersStore.category_id === categoryId) {
          this.props.layersStore.category_id = null;
        }else {
          this.props.layersStore.category_id = categoryId;
          this.props.layersStore.selected_category = categoryId;
        }
        this.props.filterCallback(event)
      }
    };

    this.handleTermClick = (event) => {

      const termId = parseInt(event.target.dataset.termId, 10);
      const categoryId = parseInt(event.target.dataset.categoryId, 10);
      // ensure there is never a category ID and term ID set on the store at the same time.
      this.props.layersStore.category_id = null;
      if(this.props.layersStore.term_id === termId) {
        this.props.layersStore.term_id = null;
      }else {
        this.props.layersStore.term_id = termId;
        this.props.layersStore.selected_category = categoryId;
      }
      
      setTimeout(() => this.props.singletonUiViewStore.visibleSingletonComponent.setState({visible: false}), 50);

      this.props.filterCallback(event);
    };
  }

  render() {
    const isSelected = (id) => this.props.layersStore.term_id === id ? 'is-current' : '';
    const categoryIsSelected = (this.props.layersStore.selected_category === this.props.id);

    return <ul ref={this.toggleRef} onClick={this.handleOnClick}>
      <li className={categoryIsSelected ? 'is-current' : ''}>
        <a href="#" data-category-id={this.props.id} >{this.props.name}</a>
        {this.state.visible && this.props.terms.length > 0 &&
          <ul>
            {this.props.terms.map((type, i) => {
              return <li key={`layer-type-${type.id}`} className={isSelected(type.id)}>
                <a href="#" data-term-id={type.id} data-category-id={this.props.id} onClick={this.handleTermClick}>{type.name}</a>
              </li>
            })}
          </ul>
        }
      </li>
    </ul>;
  }
}
