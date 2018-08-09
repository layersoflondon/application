import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import PlaceDetails from './place_details';
import {observer} from 'mobx-react';
import ReactQuill from 'react-quill';

@observer class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {title: '', description: this.props.recordFormStore.record.description};
  }

  handleDescriptionChange(value) {
    this.setState({description: value});
    this.props.recordFormStore.record.description = value;
  }

  render() {
    let description = this.props.recordFormStore.record.description;
    // if(description.length) {
    //   description = description.map((el) => el.props.children).join("\n").replace(/^\n/,'');
    // }else {
    //   console.log(description);
    // }

    const modules = {
      toolbar: [
        [{'header': [1, 2, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        // ['link', 'image'],
        // ['clean']
      ]
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];

    return (
      <div>
        <div className="form-group form-group--title">
          <label>Title</label>
          <input type="text" name="title" value={this.props.recordFormStore.record.title} onChange={this.handleOnChange} onBlur={this.createDraftRecord} className={`${this.appendErrorClassNameToField('title')}`} />
        </div>

        <PlaceDetails {...this.props} />

        <div className="form-group form-group--description">
          <label>Description</label>
          <ReactQuill theme="snow" modules={modules} formats={formats} value={this.state.description} onChange={this.handleDescriptionChange.bind(this)} className={`${this.appendErrorClassNameToField('description')}`} />
          {/*<textarea rows="10" placeholder="" name="description" value={description} onChange={this.handleOnChange} className={`${this.appendErrorClassNameToField('description')}`}>*/}
          {/*</textarea>*/}
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Details);
