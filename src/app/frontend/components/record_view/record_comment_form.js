import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import ReactQuill from 'react-quill';
import Comment from '../../sources/comment';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';

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

      this.setState({content: null, status: null, errors: null});
    }).catch((error) => {
      this.setState({errors: error.response.data});
    });
  }

  render() {
    if( !this.props.currentUser.id ) {
      const return_to = this.props.location.pathname;
      return (
          <div className="m-comments">
            <a href={`/users/sign_up?return_to=${return_to}`}>Sign Up</a> or <a href={`/users/sign_in?return_to=${return_to}`}>Log in</a> to make a comment.
          </div>
      )
    }

    const modules = {
      toolbar: [
          'bold', 'italic', 'underline'
      ]
    };

    const formats = [
        'bold', 'italic', 'underline'
    ];

    const errors = <ul className="errors">{(this.state.errors || []).map((error, i) => <li key={`comment-error-${i}`}>{error}</li>)}</ul>;

    return <div className="m-comment-form">
      <h3>Add a comment</h3>
      {
        this.state.errors && this.state.errors.length>0 &&
        errors
      }
      <ReactQuill theme="snow" modules={modules} formats={formats} value={this.state.content} onChange={this.handleChange.bind(this)} />
      <button onClick={this.submitComment.bind(this)}>Add</button>
    </div>
  }
}
