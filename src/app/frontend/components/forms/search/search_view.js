import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Search from "../../../sources/search";
import SearchTagGroups from "./search_tag_groups";
import {recordEvent} from "../../../config/data_layer";
import {closeModalLink} from '../../../helpers/modals';
import pluralize from 'pluralize';
import PlaceSearch from "../../place_search";

@inject('router', 'mapViewStore', 'trayViewStore', 'tagGroupsStore')
@withRouter
@observer export default class SearchView extends Component {
  constructor(props) {
    super(props);

    this.tagGroupsRef = React.createRef();

    this.state = {
      q: "",
      geobounding: 'london',
      start_year: "",
      end_year: "",
      showing_results: false,
      terms: {type: [], theme: []},
      collections: false,
      selectedTagCount: 0
    };

    this.closeEventHandler = (event) => {
      if (event.target.classList.contains('s-overlay--search')) {
        this.setState({visibleTagGroup: null});
      }
    };

    this.toggleTagGroup = (id) => {
      let value = parseInt(id, 10);

      if (this.state.visibleTagGroup === value) {
        value = null;
        document.querySelector("[class^='s-overlay']").removeEventListener('click', this.closeEventHandler);
      } else {
        document.querySelector("[class^='s-overlay']").addEventListener('click', this.closeEventHandler);
      }

      this.setState({visibleTagGroup: value});
    };

    this.handleUpdateTagCount = (count) => {
      this.setState({
        selectedTagCount: count
      });
    };

    this.clearSelectedTags = () => {
      this.props.tagGroupsStore.clearSelectedTags();
    };

    this.clearAll = () => {
    }
  }

  componentWillMount() {
    this.setInitialState();
  }

  componentWillReceiveProps() {
    this.setInitialState(true);
    if (this.state.showing_results) {
      recordEvent('mapSearch', {
        'mapSearch': this.state.q
      });
    }
  }

  toggleTerm(event) {
    const {target: {name, value}} = event;

    const terms = this.state.terms;
    const current_terms = terms[name].slice();
    const term_index = current_terms.indexOf(value);

    if (term_index === -1) {
      current_terms.push(value);
    } else {
      current_terms.splice(term_index, 1);
    }

    terms[name] = current_terms;
    this.setState({terms: terms});
  }

  isChecked(event) {
    const {target: {name, value}} = event;

    return this.state.terms[name].indexOf(value) > -1 ? true : '';
  }

  getBounds() {
    let map = this.props.trayViewStore.map_ref;
    let center = map.leafletElement.getBounds().getCenter();
    let radius = map.leafletElement.getBounds().getNorthEast().distanceTo(center) / 1000;

    let north_west = map.leafletElement.getBounds().getNorthWest();
    let south_east = map.leafletElement.getBounds().getSouthEast();

    return {
      // center: {lat: center.lat, lng: center.lng},
      top_left: {lat: north_west.lat, lng: north_west.lng},
      bottom_right: {lat: south_east.lat, lng: south_east.lng},
      // radius: radius
    };
  }

  handleOnChange(event) {
    const {target: {name, value}} = event;
    this.setState({[name]: value});
  }

  toggleSearchBounds(event) {
    if (event.target.checked) {
      this.setState({geobounding: this.getBounds()});
    } else {
      this.setState({geobounding: 'london'});
    }
  }

  handleKeyUp(event) {
    if (event.nativeEvent.key === "Enter") {
      this.handleSearchOnClick();
    }
  }

  handleSearchOnClick(event) {
    const search_params = {};

    if (this.state.q) {
      search_params.q = this.state.q;
    }

    if (this.state.user_id) {
      search_params.user_id = this.state.user_id;
    }

    if (this.state.terms) {
      search_params.terms = this.state.terms;
    }

    if (this.state.start_year) {
      if (!search_params.date_range) search_params.date_range = {};

      search_params.date_range.gte = `${this.state.start_year}-01-01`;
    }

    if (this.state.end_year) {
      if (!search_params.date_range) search_params.date_range = {};

      search_params.date_range.lte = `${this.state.end_year}-01-01`;
    }

    if (this.state.geobounding !== 'london') {
      search_params.geobounding = this.getBounds()
    }

    if (this.state.collections) {
      search_params.collections = true;
    }

    search_params.tag_ids = this.props.tagGroupsStore.checkedTagIds.join(',');

    function serializeQuery(params, prefix) {
      const query = Object.keys(params).map((key) => {
        if (key === 'collections') {
          return;
        }
        const value = params[key];

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

    let header_subtitle = "";

    if (!!this.state.start_year || !!this.state.end_year) {
      header_subtitle = `${!!this.state.start_year ? this.state.start_year : "up"} to ${!!this.state.end_year ? this.state.end_year : "now"}`
    }

    if (this.state.collections) {
      header_subtitle = "for your collection search"
    }

    Search.perform(search_params).then((response) => {
      this.props.trayViewStore.loading = false;
      this.props.trayViewStore.trayLocked = true;
      this.props.trayViewStore.searchParams = search_params;

      const {push} = {...this.props.router};
      const params = serializeQuery(search_params).replace(/&&/, '');
      // push(`?results=true&q=${this.state.q}`);
      this.setState({showing_results: true});
      // this.props.trayViewStore.setHeaderContent({
      //   title: header_title,
      //   subtitle: !!this.state.q ? header_subtitle : "",
      //   tray_view_type: "Search"
      // });
      this.props.trayViewStore.showCollectionOfCards(response.data);

      if (response.data.length > 0) {
        // get first response object with a lat & lng (if it's a collection, get the first one with records)
        const results_with_coords = response.data.filter((obj) => {
          return (obj.hasOwnProperty('records') && obj.records.length > 0) || obj.hasOwnProperty('lat');
        });

        let first_result = results_with_coords[0];

        if (first_result.hasOwnProperty('records')) {
          first_result = first_result.records[0];
        }

        const lat = first_result.lat;
        const lng = first_result.lng;

        this.props.mapViewStore.panTo(lat, lng);
      }

      this.props.trayViewStore.root = false;

      this.props.router.history.push(`/map/search?show_results=true&${params}`)
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
    const user_match = location.search.match(/user_id=([^$,&]+)/);
    const collections_match = location.search.search(/collections=true/);

    let state = {showing_results: false, collections: false};

    if (showing_results_match && showing_results_match > -1) {
      state.showing_results = true;
    }

    if (query_match && query_match.length > 1) {
      state.q = query_match[1];
    }

    if (user_match && user_match.length > 1) {
      state.user_id = user_match[1];
    }

    if (start_year_match && start_year_match.length > 1) {
      state.start_year = start_year_match[1];
    }

    if (end_year_match && end_year_match.length > 1) {
      state.end_year = end_year_match[1];
    }

    if (collections_match && collections_match > -1) {
      state.collections = true
    }

    /**
     * if we have a results=true param, and we're mounting the component (not receiving updated props),
     * perform the search this will only  happen if the initial route is mapped to this component with
     * a query string (user refreshes the search results page
     */
    if (showing_results_match > -1 && !updated_props) {
      this.setState(state);

      setTimeout(() => {
        this.handleSearchOnClick();
      }, 50);
    } else {
      this.setState(state);
    }
  }

  handleClearTags(event) {
    this.setState({visibleTagGroup: null});
    this.props.tagGroupsStore.uncheckTagsInAllGroups();
  }

  render() {
    if (!this.props.mapViewStore.modalIsVisible('search')) return <React.Fragment/>;

    let className = "m-overlay is-showing";
    // if( this.state.showing_results || this.props.trayViewStore.loading ) {
    //   return <span></span>;
    // }

    // const taxonomies = Object.entries(window.__TAXONOMIES).map((taxonomy) => <SearchViewTaxonomy key={taxonomy[0]} taxonomy={taxonomy} toggleMethod={this.toggleTerm.bind(this)} isCheckedMethod={this.isChecked.bind(this)} />);

    const toggle_classname = (this.state.geobounding !== 'london') ? 'is-toggled' : "";
    return (
      <div className={className}>
        <div className="s-overlay--search is-showing">

          <div className="close">
            <Link to={closeModalLink(this.props.router.location, 'search')} className="close" onClick={() => this.props.mapViewStore.searchModal = false}>Close</Link>
          </div>

          <div className="m-search-overlay">

            {/* <form> container */}
            <div className="form--chunky">
              <PlaceSearch />

              <h1>Record search</h1>

              <div className={`form-group form-group--toggle-switch ${toggle_classname}`}>
                <label>
                  <span>Search all of London</span>
                  <input type="checkbox" onChange={this.toggleSearchBounds.bind(this)} checked={this.state.geobounding !== 'london'}/>
                  <span className="toggle"></span>
                  <span>Search visible area</span>
                </label>
              </div>

              <div className="form-group form-group--primary-field">
                <input placeholder="Enter a topic…" type="text" name="q" onKeyUp={this.handleKeyUp.bind(this)} value={this.state.q} onChange={this.handleOnChange.bind(this)}/>
              </div>

              <div className="form-group">
                <button className="submit-button" onClick={this.handleSearchOnClick.bind(this)}>Search the records</button>
              </div>

              <SearchTagGroups toggleTagGroup={this.toggleTagGroup} updateTagCount={this.handleUpdateTagCount}/>

              <div className="date-range">

                <div className="subsection-header">
                  <h1 className="label">Add dates or eras</h1>
                  <button onClick={() => this.setState({era_picker_visible: !this.state.era_picker_visible})}>Pick an
                    era
                  </button>
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">Start year</h2>
                  <input placeholder="Start year" type="text" name="start_year" value={this.state.start_year} onChange={this.handleOnChange.bind(this)}/>
                </div>

                <div className="date-box date-box--start">
                  <h2 className="label">End year</h2>
                  <input placeholder="End year" type="text" name="end_year" value={this.state.end_year} onChange={this.handleOnChange.bind(this)}/>
                </div>

                {this.state.era_picker_visible &&
                <div className="era-picker" style={{display: 'block'}}>
                  <h2>Choose an era:</h2>

                  <ul className="eras">
                    <li><a href="#" onClick={() => this.setState({start_year: '', end_year: 55})}>Pre-Roman<span>Pre-55AD</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({
                      start_year: 55,
                      end_year: 410
                    })}>Roman<span>55-410</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 410, end_year: 1216})}>Early Medieval
                      <span>410-1216</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1216, end_year: 1398})}>High Medieval
                      <span>1216-1398</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1398, end_year: 1485})}>Late Medieval
                      <span>1398-1485</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1485, end_year: 1603})}>Tudor <span>1485-1603</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1558, end_year: 1603})}>Elizabethan <span>1558-1603</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1603, end_year: 1714})}>Stuart <span>1603-1714</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1714, end_year: 1837})}>Hanoverian <span>1714-1837</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1837, end_year: 1901})}>Victorian <span>1837-1901</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1901, end_year: 1914})}>Edwardian <span>1901-1914</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1914, end_year: 1918})}>World War I <span>1914-1918</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1918, end_year: 1939})}>Interwar <span>1918-1939</span></a>
                    </li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1939, end_year: 1945})}>World War II
                      <span>1939-1945</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 1945, end_year: 1999})}>Post World War II
                      <span>1945-1999</span></a></li>
                    <li><a href="#" onClick={() => this.setState({start_year: 2000, end_year: ''})}>21st Century <span>2000-Now</span></a>
                    </li>
                  </ul>
                </div>
                }
              </div>

              {this.props.tagGroupsStore.totalCheckedCount > 0 &&
                <span onClick={this.handleClearTags.bind(this)}>Clear {pluralize('tag', this.props.tagGroupsStore.totalCheckedCount, true)}</span>
              }

              <div className="form-group">
                <button className="submit-button" onClick={this.handleSearchOnClick.bind(this)}>Search the records</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
