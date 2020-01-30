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
      this.props.singletonUiViewStore.visibleSingletonComponent = this;
    }
  }

  render() {
    return <ul ref={this.toggleRef} onClick={this.handleOnClick}>
      <li>
        <a href="#">{this.props.name}</a>
        {this.state.visible &&
          <ul>
            {this.props.types.map((type, i) => {
              return <li key={`layer-type-${i}`}><a href="#">{type}</a></li>
            })}
          </ul>
        }
      </li>
    </ul>;
  }
}
