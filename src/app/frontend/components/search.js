import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";

@inject('mapViewStore')
@withRouter
@observer export default class Search extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(event) {
    this.props.mapViewStore.overlay = null
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

            <div className="form-group form-group--single-checkbox">
              <label>
                <input type="checkbox" />
                <span>Only search in area shown on map</span>
              </label>
            </div>

            <div className="form-group form-group--primary-field">
              <input placeholder="Enter a place or topic…" type="text" />
            </div>

            <div className="form-group form-group--checklist form-group--replaced-checkboxes">
              <h2>Media</h2>
              <label>
                <input type="checkbox" defaultChecked />
                <span>Images</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Video</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Audio</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>File uploads</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
            </div>

            <div className="form-group form-group--checklist form-group--replaced-checkboxes">
              <h2>Type</h2>
              <label>
                <input type="checkbox" defaultChecked />
                <span>Places</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>People</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Items</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Events</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
            </div>

            <div className="form-group form-group--checklist form-group--replaced-checkboxes">
              <h2>Theme</h2>
              <label>
                <input type="checkbox" />
                <span>Political &amp; government</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Social &amp; health</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Education</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" defaultChecked />
                <span>Industry &amp; commerce</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Religion &amp; worship</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" />
                <span>Transport</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
              <label>
                <input type="checkbox" defaultChecked />
                <span>War &amp; conflict</span>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></label>
            </div>

            <div className="form-group">
              <input value="Search" type="submit" />
            </div>

            <div className="date-range-link">
              <a href="#">
                <h1>Search by date range</h1>
                <p>You can set a date range too by clicking the clock icon in the tool bar.</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
