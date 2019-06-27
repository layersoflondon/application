import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import ReactQuill from 'react-quill';
import Comment from '../../sources/comment';
import {withRouter} from 'react-router-dom';

@inject('currentUser')
@withRouter
@observer export default class RecordCommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {status: null, content: ''};
  }

  handleChange(content) {
    this.setState({content: content});
  }

  submitComment(event) {
    const params = {
      comment: {
        content: this.state.content
      }
    };

    Comment.create(this.props.match.params.id, params).then((response) => {
      console.log("Got response: ", response);
    });
  }

  render() {
    const modules = {
      toolbar: [
        ['bold']
      ]
    };

    const formats = [
    ];

    return <div className="m-comment-form">
      <ReactQuill theme="bubble" modules={modules} formats={formats} value={this.state.content} onChange={this.handleChange.bind(this)} />
      <button onClick={this.submitComment.bind(this)}>Submit</button>
    </div>
  }
}
