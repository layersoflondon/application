import React,{Component, Fragment} from 'react';
import {inject, observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import Record from '../../sources/record';

@inject('currentUser', 'router')
@observer class RecordViewReport extends Component {
  constructor(props) {
    super(props);

    let email = null;
    if(this.props.currentUser && this.props.currentUser.email) {
      email = this.props.currentUser.email;
    }

    this.issues = {copyright: "Copyright", inappropriate: "Inappropriate or offensive", inaccurate: "Inaccurate"};
    this.state = {form: {issue: Object.keys(this.issues)[0], message: '', email: email}, errors: []};
  }

  handleCloseOnClick(event) {
  }

  handleChange(event) {
    let {name,value} = event.target;
    const form = this.state.form;
    form[name] = value;

    this.setState({form: form});
  }

  sendReport(event) {
    const path = this.props.router.location.pathname.split("/");
    path.splice(-1, 1);

    Record.report(null, {report: this.state.form}).then((response) => {
      this.props.router.push(path.join("/"));
      this.setState({form: {issue: Object.keys(this.issues)[0], message: '', email: email}, errors: []});
    }).catch((error) => {
      this.setState({errors: error.response.data});
    });
  }

  render() {
    const choices = Object.keys(this.issues).map((key, i) => {
      return<label key={i}>
        <input type='radio' name='issue' value={key} checked={this.state.form.issue === key} onChange={this.handleChange.bind(this)} />
        <span>{this.issues[key]}</span>
      </label>
    });

    const errors = this.state.errors.map((e, i) => <li key={i}>{e}</li>);

    return <Fragment>
      <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
        <div className="close">
          <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
        </div>

        <div className="m-record-report form--chunky">
          <h1>Report this record</h1>

          {this.state.errors.length > 0 && (
            <ul>{errors}</ul>
          )}

          <div>

            <div className="form-group form-group--checkboxes-rows">
              <span className="label">Reason for reporting</span>
            {choices}
            </div>

            <div className="form-group">
              <label>Provide a brief message to support your report</label>
              <textarea name="message" onChange={this.handleChange.bind(this)}></textarea>
            </div>

            {!this.props.currentUser && (
              <p>
                <label>
                  Your email address
                  <input type="email" name="email" />
                </label>
              </p>
            )}

            <button onClick={this.sendReport.bind(this)}>Send</button>
          </div>
        </div>
      </div>
    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewReport);