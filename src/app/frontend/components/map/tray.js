import React, {PureComponent} from 'react';
import RecordCard from './record_card';

class Tray extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {cart_objects: [
        {id: 1, name: "An example"},
        {id: 2, name: "Another example"},
        {id: 3, name: "Hello world"},
        {id: 4, name: "the last example"}
    ]};
  }

  render() {
    const cards = this.state.cart_objects.map( (c) => {return <RecordCard key={c.id} name={c.name} />});
    return <div id="tray-container">
      tray:
      <hr/>
      {cards}
    </div>;
  }
}

export default Tray;
