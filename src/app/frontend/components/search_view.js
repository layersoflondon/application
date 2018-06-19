import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Search from "../sources/search";
import L from "leaflet";
window.L = L;

@inject('routing', 'mapViewStore', 'trayViewStore')
@withRouter
@observer export default class SearchView extends Component {
  constructor(props) {
    super(props);

    this.state = {q: '', era_picker_visible: false, type_picker_visible: false, search_bounds: 'london', start_year: '', end_year: ''};
  }

  toggleSearchBounds(event) {
    if(event.target.checked) {
      let map = this.props.trayViewStore.map_ref;
      let center = map.leafletElement.getBounds().getCenter();
      let radius = map.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;

      let bounds = {
        center: {lat: center.lat, lng: center.lng},
        north_east: map.leafletElement.getBounds().getNorthEast(),
        south_west: map.leafletElement.getBounds().getSouthWest(),
        radius: radius
      };

      this.setState({search_bounds: bounds});
    }else {
      this.setState({search_bounds: 'london'});
    }
  }

  setInitialState(updated_props = false) {
    const showing_results_match = location.search.search(/results=true/);
    const query_match = location.search.match(/q=([^$,&]+)/);
    const start_year_match = location.search.match(/start_year=([^$,&]+)/);
    const end_year_match = location.search.match(/end_year=([^$,&]+)/);

    let state = {showing_results: false};

    if(showing_results_match && showing_results_match>-1) {
      state.showing_results = true;
    }

    if(query_match && query_match.length>1) {
      state.q = query_match[1];
    }

    if(start_year_match && start_year_match.length>1) {
      state.start_year = start_year_match[1];
    }

    if(end_year_match && end_year_match.length>1) {
      state.end_year = end_year_match[1];
    }

    if( showing_results_match>-1 && !updated_props) {
      this.setState(state);

      setTimeout(() => {
        this.handleSearchOnClick();
      }, 50);
    }else {
      this.setState(state);
    }
  }

  componentWillMount() {
    this.setInitialState();
  }

  componentWillReceiveProps() {
    this.setInitialState(true);
  }

  handleOnChange(event) {
    this.setState({q: event.target.value});
  }

  handleSearchOnClick(event) {
    Search.perform(this.state).then((response) => {
      const {push} = {...this.props.routing};
      const search_params = {q: this.state.q, start_year: this.state.start_year, end_year: this.state.end_year};
      const params = Object.keys(search_params).reduce(function(a,k){a.push(k+'='+encodeURIComponent(search_params[k]));return a},[]).join('&');

      push(`?results=true&${params}`);
      this.setState({showing_results: true});
      this.props.trayViewStore.showCollectionOfRecords(response.data, `Searched for ${this.state.q}`, `${response.data.length} results`);
    });
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'search' ) className += " is-showing";

    if( this.state.showing_results ) {
      return <span></span>;
    }

    return (
      <div className={className}>
        <div className="s-overlay--search is-showing">

          <div className="close">
            <Link to="/map" className="close">Close</Link>
          </div>

          <div className="m-search-overlay">
            <h1>Search</h1>

            {/* <form> container */}
            <div className="form--chunky">
              <div className="form-group form-group--toggle-switch">
                <label>
                  <span>Search all of London</span>
                  <input type="checkbox" onChange={this.toggleSearchBounds.bind(this)} checked={this.state.search_bounds !== 'london'} />
                  <span className="toggle"></span>
                  <span>Search visible area</span>
                </label>
              </div>

              <div className="form-group form-group--primary-field">
                <input placeholder="Enter a place or topic…" type="text" onChange={this.handleOnChange.bind(this)} value={this.state.q} />
              </div>

              <div className="date-range">

                <div className="subsection-header">
                  <h1 className="label">Date range</h1>
                  <button onClick={() => this.setState({era_picker_visible: !this.state.era_picker_visible})}>Pick an era</button>
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">Start year</h2>
                  <input placeholder="Start year" type="text" value={this.state.start_year} onChange={(event, value) => this.setState({start_year: value})}/>
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">End year</h2>
                  <input placeholder="End year" type="text" value={this.state.end_year} onChange={(event, value) => this.setState({end_year: value})} />
                </div>

                {this.state.era_picker_visible &&
                <div className="era-picker" style={{display: 'block'}}>
                  <h2>Choose an era:</h2>

                  <ul className="eras">
                    <li><a href="#" onClick={() => this.setState({start_year: 410, end_year: 1216})}>Early Medieval <span>410-1216</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1216, end_year: 1398})}>High Medieval <span>1216-1398</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1398, end_year: 1485})}>Late Medieval <span>1398-1485</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1485, end_year: 1603})}>Tudor <span>1485-1603</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1558, end_year: 1603})}>Elizabethan <span>1558-1603</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1603, end_year: 1714})}>Stuart <span>1603-1714</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1714, end_year: 1837})}>Hanoverian <span>1714-1837</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1837, end_year: 1901})}>Victorian <span>1837-1901</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1901, end_year: 1914})}>Edwardian <span>1901-1914</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1914, end_year: 1918})}>World War I <span>1914-1918</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1918, end_year: 1939})}>Interwar <span>1918-1939</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1945, end_year: 1999})}>Post World War II <span>1945-1999</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 2000, end_year: ''})}>21st Century <span>2000-Now</span></a></li>
                  </ul>
                </div>
                }

              </div>

              <div className="filters">

                <div className="filters-show">
                  <button onClick={() => this.setState({type_picker_visible: !this.state.type_picker_visible})}>Filter by Media, Type, Theme</button>
                </div>

                {this.state.type_picker_visible &&
                <div className="filters-content">
                  <div className="form-group form-group--checklist form-group--replaced-checkboxes">
                    <h2 className="label">Media</h2>
                    <label>
                      <input type="checkbox"/>
                      <span>Images</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Video</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Audio</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Documents</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                  </div>

                  <div className="form-group form-group--checklist form-group--replaced-checkboxes">
                    <h2 className="label">Type</h2>
                    <label>
                      <input type="checkbox"/>
                      <span>Places</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>People</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Items</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Events</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                  </div>

                  <div className="form-group form-group--checklist form-group--replaced-checkboxes">
                    <h2 className="label">Theme</h2>
                    <label>
                      <input type="checkbox"/>
                      <span>Political &amp; government</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Social &amp; health</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Education</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Industry &amp; commerce</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Religion &amp; worship</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>Transport</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                    <label>
                      <input type="checkbox"/>
                      <span>War &amp; conflict</span>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg>
                    </label>
                  </div>
                </div>
                }

              </div>

              <div className="form-group">
                <button className="submit-button" onClick={this.handleSearchOnClick.bind(this)}>Search</button>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}
