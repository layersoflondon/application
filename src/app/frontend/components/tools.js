import React,{Component} from 'react';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';

@observer export default class Tools extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(event) {
    this.props.mapViewStore.overlay = event.target.dataset.overlay;
  }

  handleOnClickAddRecord(event) {
    this.props.mapViewStore.add_record_mode = true;
  }

  render() {
    return <div className="m-sidebar">
      <div className="m-tools">
        <div className="m-tool-button m-tool-button--search">
          <button data-label="Search" data-overlay="search" onClick={this.handleOnClick.bind(this)}><span>Search</span></button>
        </div>
        <div className="m-tool-button m-tool-button--date-range">
          <button data-label="Date range"><span>Date range</span></button>
        </div>
        <div className="m-tool-button m-tool-button--layers">
          <button data-label="Layers" data-overlay="layers" onClick={this.handleOnClick.bind(this)}><span>Layers</span></button>
        </div>
        <div className="m-tool-button m-tool-button--add-collection">
          <button data-label="Create collection" data-overlay="collection_form" onClick={this.handleOnClick.bind(this)}><span>Create collection</span></button>
        </div>
        <div className="m-tool-button m-tool-button--add">
          <button data-label="Add record" data-overlay="record_form" onClick={this.handleOnClickAddRecord.bind(this)}><span>Add record</span></button>
        </div>
      </div>
      <div className="m-actions">
        <div className="m-tool-button m-tool-button--your-account">
          <button data-label="Your account" data-overlay="user_form" onClick={this.handleOnClick.bind(this)}><span>Your profile</span></button>
        </div>
      </div>
    </div>;
  }
}

Tools.propTypes = {
  mapViewStore: PropTypes.object.isRequired
};
