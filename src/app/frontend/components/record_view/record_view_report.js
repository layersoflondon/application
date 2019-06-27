import React,{Component, Fragment} from 'react';
import {inject, observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import Record from '../../sources/record';
import {Link, withRouter} from 'react-router-dom';
@inject('currentUser', 'router', 'userPresent')
@withRouter
@observer class RecordViewReport extends Component {
  constructor(props) {
    super(props);

    let email = null;
    if(this.props.currentUser && this.props.currentUser.email) {
      email = this.props.currentUser.email;
    }

    this.issues = {copyright: "Copyright", inappropriate: "Inappropriate or offensive", inaccurate: "Inaccurate"};

    const params = new URLSearchParams(this.props.router.location.search);
    let form = {issue: Object.keys(this.issues)[0], message: '', email: email};

    if( params.get('comment') ) {
      this.issues = {...this.issues, comment: "Comment"};
      form = {...form, comment_id: params.get('comment'), issue: Object.keys(this.issues)[Object.keys(this.issues).length-1]};
    }

    this.state = {form: form, errors: [], record_id: this.props.router.location.pathname.split("/").slice(-2,-1), report_sent: false};
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
      this.setState({report_sent: true});
    }).catch((error) => {
      if (error.response && error.response.data) {
        this.setState({errors: error.response.data, report_sent: false});
      }
    });

  }

  formContent() {

    const choices = Object.keys(this.issues).map((key, i) => {
      return<label key={i}>
        <input type='radio' name='issue' value={key} checked={this.state.form.issue === key} onChange={this.handleChange.bind(this)} />
        <span>{this.issues[key]}</span>
      </label>
    });

    const errors = this.state.errors.map((e, i) => <li key={i}>{e}</li>);

    return (
      <div className="m-record-report form--chunky">
      <h1>Report this record</h1>
      <p>If you think there's something wrong with this record, please let us know. Your message will be sent to the Layers of London team and not the original author.</p>

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

        {!this.props.userPresent && (
          <p>
            <label>
              Your email address
            </label>
            <input type="text" name="email" onChange={this.handleChange.bind(this)} />
          </p>
        )}

        <button onClick={this.sendReport.bind(this)}>Send</button>

      </div>
    </div>
    )
  }

  thankyouContent() {
    return (
      <div className="m-record-report form--chunky">
        <h1>Your report was sent</h1>
        <p>Thanks for your help. If you need to contact us urgently you can do so by emailing <a href="mailto:layersoflondon@london.ac.uk">layersoflondon@london.ac.uk</a></p>
        <p><Link to="/map">Return to the map</Link></p>
      </div>
    )
  }

  render() {

    let content;
    if (this.state.report_sent) {
      content = this.thankyouContent();
    } else {
      content = this.formContent();
    }

    const errors = this.state.errors.map((e, i) => <li key={i}>{e}</li>);
    return <Fragment>
      <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
        <div className="close">
          <Link to={`/map/records/${this.state.record_id}`}>Close</Link>
        </div>
        { content }

      </div>
    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewReport);