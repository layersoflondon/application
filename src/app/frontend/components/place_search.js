import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from "react-router-dom";
import Place from "../sources/place";

import {closeModalLink, removeModal} from "../helpers/modals";

window.removeModal = removeModal;

@inject('mapViewStore')
@withRouter
@observer export default class PlaceSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };

    this.handleChange = ({currentTarget}) => {
      this.setState({query: currentTarget.value});
    };

    this.handleSearchOnClick = async (event) => {
      const response = await Place.search(this.state.query, {});
      this.props.mapViewStore.places = response.data;

      removeModal(this.props.location, 'search', this.props.mapViewStore);
      const path = closeModalLink(this.props.location, 'search');

      this.props.history.push(path);

      if(response.data.length>0) {
        const firstResult = this.props.mapViewStore.places.values()[0];
        this.props.mapViewStore.panTo(firstResult.lat, firstResult.lon);
      }
    };

    this.handleKeyUp = (event) => {
      if(this.state.query.length<1) return;
      
      if (event.nativeEvent.key === "Enter") {
        this.handleSearchOnClick(event);
      }
    }
  }

  render() {
    return <React.Fragment>
      <h1>Place search</h1>

      <div className="form-group form-group--primary-field">
        <input placeholder="Enter a street, place name or landmark…" type="text" name="q" value={this.state.query} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
      </div>

      <div className="form-group">
        <button className="submit-button submit-button--place-search" onClick={this.handleSearchOnClick}>Search for a place</button>
      </div>

      <hr/>
    </React.Fragment>
  }
}
