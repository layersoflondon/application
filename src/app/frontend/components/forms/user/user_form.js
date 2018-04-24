import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange(event) {
    let state = {};
    state[event.target.dataset.name] = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Handle submit", event, this.state);
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'user_form' ) className+=" is-showing";

    return (
      <div className={className}>
          <div className="s-overlay--add-collection is-showing">

              <div className="close">
                  <button className="close" onClick={()=>this.props.mapViewStore.overlay=null}>Close</button>
              </div>

              <div className="m-add-collection">
                  <iframe width="100%" height="650" src="http://localhost:3000/users/edit" frameBorder="0"></iframe>
              </div>
          </div>
      </div>
    );
  }
}
