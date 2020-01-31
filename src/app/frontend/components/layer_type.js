import React, {Component} from 'react';
import {observer} from "mobx-react";

@observer export default class LayerType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleRef = React.createRef();

    this.handleOnClick = (event) => {
      this.props.singletonUIViewStore.visibleSingletonComponent = this;
    }
  }

  render() {
    return <ul ref={this.toggleRef} onClick={this.handleOnClick}>
      <li>
        <a href="#">{this.props.data.name}</a>

        {this.state.visible &&
          <ul>
            {this.props.data.items.map((item, i) => {
              return <li key={`layer-type-${i}-${item.id}`}><a href="#" data-layer-type={this.props.data.id} data-item-id={item.id} onClick={this.props.onItemClickCallback}>{item.name}</a></li>
            })}
          </ul>
        }
      </li>
    </ul>;
  }
}
