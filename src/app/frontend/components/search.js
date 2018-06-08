import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";

@inject('mapViewStore')
@withRouter
@observer export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {era_picker_visible: false, type_picker_visible: false, constrain_search_bounds: 'london', start_year: '', end_year: ''};
  }

  toggleSearchBounds(event) {
    if(event.target.checked) {
      this.setState({constrain_search_bounds: 'london'})
    }else {
      this.setState({constrain_search_bounds: null})
    }
  }

  render() {
    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'search' ) className += " is-showing";

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
                  <input type="checkbox" onChange={this.toggleSearchBounds.bind(this)}/>
                  <span className="toggle"></span>
                  <span>Search visible area</span>
                </label>
              </div>

              <div className="form-group form-group--primary-field">
                <input placeholder="Enter a place or topic…" type="text" />
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
                <button className="submit-button">Search</button>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}
