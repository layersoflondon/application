import React, {PureComponent} from 'react';

class RecordCard extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <div id="record-cart-container">{this.props.name}</div>;
  }
}

export default RecordCard;
