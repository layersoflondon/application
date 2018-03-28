import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer export default class Tools extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="m-sidebar">
      <div className="m-tools">
        <div className="m-tool-button m-tool-button--search">
          <button data-label="Search"><span>Search</span></button>
        </div>
        <div className="m-tool-button m-tool-button--date-range">
          <button data-label="Date range"><span>Date range</span></button>
        </div>
        <div className="m-tool-button m-tool-button--layers">
          <button data-label="Layers"><span>Layers</span></button>
        </div>
        <div className="m-tool-button m-tool-button--add-collection">
          <button data-label="Create collection"><span>Create collection</span></button>
        </div>
        <div className="m-tool-button m-tool-button--add">
          <button data-label="Add record"><span>Add record</span></button>
        </div>
      </div>
      <div className="m-actions">
        <div className="m-tool-button m-tool-button--your-account">
          <button data-label="Your account"><span>Your profile</span></button>
        </div>
      </div>
    </div>;
  }
}
