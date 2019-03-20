import {Component} from "react";
import React from "react";
import Img from 'react-image';

export default class GeoreferencerProjectList extends Component {

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.setMapRef = element => {
      this.mapRef = element;
    };


  }

  render() {

    let list_items = [];


    if( this.props.images.length ) {
      this.props.images.map((c) => {
        list_items.push(
          <li key={c.id}>
            <a href={c.url}>
              {c.title} - {c.name}
              <Img src={c.image} loader={<span className="is-loading"></span>}/>
            </a>
          </li>
        )
      });
    }


    return <div className="georeferencer-project-list">
      <ul>
        {list_items}
      </ul>
    </div>

  }
}