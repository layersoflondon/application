import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import RecordViewComponentState from "./record_view_component_state";
import {NavLink, withRouter} from 'react-router-dom';
import Comment from '../../sources/comment';

@inject('router', 'currentUser')
@withRouter
@observer class RecordViewComment extends Component {
  constructor(props) {
    super(props);

    this.state = {status: null};
    this.div = React.createRef();
  }

  removeComment(event) {
    this.setState({status: 'deleting'});

    Comment.destroy(this.props.match.params.id, this.props.comment.id).then((response) => {
      this.setState({status: 'deleted'});
    });
  }

  render() {
    return <div className={`comment comment--${this.state.status || ''}`} ref={this.div}>
      <p>Comment: <strong>{this.props.comment.content}</strong></p>
      <p>User: <strong>{this.props.comment.user.name}</strong></p>
      <p>Date: <strong>{this.props.comment.datetime}</strong></p>

      <div className="comment-actions">
        <ul>
          <li>
            <NavLink to={`${this.props.router.location.pathname}/report`}>Report this Comment</NavLink>
          </li>
          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === null) &&
            <li>
              <a href="#" onClick={()=>this.setState({status: 'delete'})}>Remove Comment</a>
            </li>
          }

          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === 'delete') &&
          <li>
            Are you sure? <a href="#" onClick={this.removeComment.bind(this)}>Yes</a> <a href="#" onClick={()=>this.setState({status: null})}>Cancel</a>
          </li>
          }

          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === 'deleting') &&
          <li>
            Deleting...
          </li>
          }
        </ul>
      </div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewComment);
