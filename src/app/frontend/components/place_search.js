import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {withRouter} from "react-router-dom";
import Place from "../sources/place";

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
    };
  }

  render() {
    return <React.Fragment>
      <h1>Place search</h1>

      <div className="form-group form-group--primary-field">
        <input placeholder="Enter a street, place name or landmark…" type="text" name="q" value={this.state.query} onChange={this.handleChange} />
      </div>

      <div className="form-group">
        <button className="submit-button submit-button--place-search" onClick={this.handleSearchOnClick}>Search for a place</button>
      </div>

      <hr/>
    </React.Fragment>
  }
}
