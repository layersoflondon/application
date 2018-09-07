import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from 'mobx-react';
import {observe} from "mobx";
import ReactQuill from 'react-quill';

@observer class Credits extends Component {
  constructor(props) {
    super(props);

    this.state = {title: '', credit: ''};
  }

  componentWillMount() {
    // the component is mounted before the record is loaded from the api; a new record is created with the results of the GET request
    // so we need to observe the record itself and update the description if necessary.
    this.observerDisposer = observe(this.props.recordFormStore, 'record', (changes) => {
      if (changes.newValue) {
        this.setState({credit: changes.newValue.credit})
      }
    })
  }

  componentWillUnmount() {
    this.observerDisposer();
  }

  handleCreditChange(value) {
    this.setState({credit: value});
    this.props.recordFormStore.record.credit = value;
  }

  render() {
    const creditsLabelClassName = !!this.props.recordFormStore.record.errors_on_publishing['credit'] ? "errors-on-publish" : "";

    const modules = {
      toolbar: [
        ['link']
      ]
    };

    const formats = [
      'link'
    ];

    return (
      <div>
        <div className="form-group form-group--credits">
          <label className={creditsLabelClassName}>Credits and attribution</label>
          <span className="helper-text">Highlight your text to add a link.</span>
          <ReactQuill theme="bubble" modules={modules} formats={formats} value={this.state.credit} onChange={this.handleCreditChange.bind(this)} onBlur={this.handleOnBlur} className={`${this.appendErrorClassNameToField('credit')}`} />
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Credits);
