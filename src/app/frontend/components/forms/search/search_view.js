import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import SearchViewTaxonomy from "./_search_view_taxonomy";
import Search from "../../../sources/search";

@inject('router', 'mapViewStore', 'trayViewStore')
@withRouter
@observer export default class SearchView extends Component {
  constructor(props) {
    super(props);

    this.state = {q: "", geobounding: false, start_year: "", end_year: "", showing_results: false, terms: {type: [], theme: []}};
  }

  componentWillMount() {
    this.setInitialState();
  }

  componentWillReceiveProps() {
    this.setInitialState(true);
  }

  toggleTerm(event) {
    const {target: { name, value }} = event;

    const terms = this.state.terms;
    const current_terms = terms[name].slice();
    const term_index = current_terms.indexOf(value);

    if(term_index === -1) {
      current_terms.push(value);
    }else {
      current_terms.splice(term_index, 1);
    }

    terms[name] = current_terms;
    this.setState({terms: terms});
  }

  isChecked(event) {
    const {target: { name, value }} = event;

    return this.state.terms[name].indexOf(value)>-1 ? true : '';
  }

  handleOnChange(event) {
    const {target: {name, value}} = event;
    this.setState({[name]: value});
  }

  toggleSearchBounds(event) {
    if(event.target.checked) {
      let map = this.props.trayViewStore.map_ref;
      let center = map.leafletElement.getBounds().getCenter();
      let radius = map.leafletElement.getBounds().getNorthEast().distanceTo(center)/1000;

      let north_west = map.leafletElement.getBounds().getNorthWest();
      let south_east = map.leafletElement.getBounds().getSouthEast();

      let bounds = {
        // center: {lat: center.lat, lng: center.lng},
        top_left: {lat: north_west.lat, lng: north_west.lng},
        bottom_right: {lat: south_east.lat, lng: south_east.lng},
        // radius: radius
      };

      this.setState({geobounding: bounds});
    }else {
      this.setState({geobounding: null});
    }
  }

  handleKeyUp(event) {
    if( event.nativeEvent.key === "Enter" ) {
      this.handleSearchOnClick();
    }
  }

  handleSearchOnClick(event) {
    const search_params = {
      q: this.state.q,
      terms: this.state.terms
    };

    if( this.state.start_year ) {
      if(!search_params.date_range) search_params.date_range = {};

      search_params.date_range.gte = `${this.state.start_year}-01-01`;
    }

    if( this.state.end_year ) {
      if(!search_params.date_range) search_params.date_range = {};

      search_params.date_range.lte = `${this.state.end_year}-01-01`;
    }

    if( this.state.geobounding ) {
      search_params.geobounding = this.state.geobounding;
    }

    function serializeQuery(params, prefix) {
      const query = Object.keys(params).map((key) => {
        const value  = params[key];

        if (params.constructor === Array)
          key = `${prefix}[]`;
        else if (params.constructor === Object)
          key = (prefix ? `${prefix}[${key}]` : key);

        if (typeof value === 'object')
          return serializeQuery(value, key);
        else
          return `${key}=${encodeURIComponent(value)}`;
      });

      return [].concat.apply([], query).join('&');
    }

    this.props.trayViewStore.loading = true;
    Search.perform(search_params).then((response) => {
      this.props.trayViewStore.loading = false;
      const {push} = {...this.props.router};
      const params = serializeQuery(search_params);
      push(`?results=true&q=${this.state.q}`);
      this.setState({showing_results: true});
      this.props.trayViewStore.showCollectionOfCards(response.data, `Searched for ${this.state.q}`);
      this.props.trayViewStore.locked = true;
      this.props.trayViewStore.root = false;
    });
  }

  /**
   * set the initial component state from the query string params
   **/
  setInitialState(updated_props = false) {
    const showing_results_match = location.search.search(/results=true/);
    const query_match = location.search.match(/q=([^$,&]+)/);
    const start_year_match = location.search.match(/date_range\[gte\]=([^-]+)/);
    const end_year_match = location.search.match(/date_range\[lte\]=([^-]+)/);

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

    /**
     * if we have a results=true param, and we're mounting the component (not receiving updated props),
     * perform the search this will only  happen if the initial route is mapped to this component with
     * a query string (user refreshes the search results page
     */
    if( showing_results_match>-1 && !updated_props) {
      this.setState(state);
      
      setTimeout(() => {
        this.handleSearchOnClick();
      }, 50);
    }else {
      this.setState(state);
    }
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'search' ) className += " is-showing";

    if( this.state.showing_results || this.props.trayViewStore.loading ) {
      return <span></span>;
    }

    const taxonomies = Object.entries(window.__TAXONOMIES).map((taxonomy) => <SearchViewTaxonomy key={taxonomy[0]} taxonomy={taxonomy} toggleMethod={this.toggleTerm.bind(this)} isCheckedMethod={this.isChecked.bind(this)} />);

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
                  <input type="checkbox" onChange={this.toggleSearchBounds.bind(this)} checked={this.state.geobounding !== false} />
                  <span className="toggle"></span>
                  <span>Search visible area</span>
                </label>
              </div>

              <div className="form-group form-group--primary-field">
                <input placeholder="Enter a place or topic…" type="text" name="q" onKeyUp={this.handleKeyUp.bind(this)} value={this.state.q} onChange={this.handleOnChange.bind(this)} />
              </div>

              <div className="date-range">

                <div className="subsection-header">
                  <h1 className="label">Date range</h1>
                  <button onClick={() => this.setState({era_picker_visible: !this.state.era_picker_visible})}>Pick an era</button>
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">Start year</h2>
                  <input placeholder="Start year" type="text" name="start_year" value={this.state.start_year} onChange={this.handleOnChange.bind(this)} />
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">End year</h2>
                  <input placeholder="End year" type="text" name="end_year" value={this.state.end_year} onChange={this.handleOnChange.bind(this)} />
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


                  {taxonomies}

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
