import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import ReactQuill from 'react-quill';
import Comment from '../../sources/comment';
import {withRouter} from 'react-router-dom';

@inject('currentUser', 'trayViewStore')
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
      const comments = this.props.trayViewStore.record.comments.slice();
      comments.push(response.data);
      this.props.trayViewStore.record.comments = comments;

      this.setState({content: "", status: null});
    });
  }

  render() {
    const modules = {
      toolbar: [
          'bold', 'italic', 'underline'
      ]
    };

    const formats = [
        'bold', 'italic', 'underline'
    ];

    return <div className="m-comment-form">
      <h3>Add a comment</h3>
      <ReactQuill theme="snow" modules={modules} formats={formats} value={this.state.content} onChange={this.handleChange.bind(this)} />
      <button onClick={this.submitComment.bind(this)}>Add</button>
    </div>
  }
}
