import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import Comment from '../../sources/comment';
import RecordViewComment from './record_view_comment'
import RecordCommentForm from './record_comment_form';
import {NavLink} from 'react-router-dom';

@inject('currentUser')
@observer
export default class RecordViewComments extends Component {
  constructor(props) {
    super(props);

    this.state = {status: 'loading'};
  }

  componentDidMount() {
    Comment.index(this.props.record.id).then((response) => {
      this.setState({status: 'loaded'});
      this.props.record.comments = response.data;
    });
  }

  renderLoggedIn() {
    if( this.state.status === 'loaded' ) {
      const comments = this.props.record.comments.map((comment, i) => <RecordViewComment key={`record-${this.props.record.id}-comment-${i}`} comment={comment} />);
      return <div className={`m-comments ${this.state.status === 'loading' ? 'is-loading' : ''}`}>
        {/*<h3>Comments</h3>*/}
        {comments}

        <RecordCommentForm />
      </div>

    }else {
      return <span>...</span>
    }
  }

  render() {
    if( this.props.currentUser.id ) {
      return this.renderLoggedIn();
    }else {
      return (
          <div className="m-comments">
            <div className="note">Want to add a comment to this record? <NavLink to='/users/sign_up'>Sign Up</NavLink> or <NavLink to='/users/sign_in'>Log in</NavLink>.</div>
          </div>
      )
    }
  }
}
