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
      <div className="comment-header">
        By <span className="comment-user">{this.props.comment.user.name}</span> on <span className="comment-date">{this.props.comment.datetime}</span>
      </div>

      <div className="comment-content" dangerouslySetInnerHTML={{__html: this.props.comment.content}}>
      </div>

      <div className="comment-footer">
        <ul className="actions">
          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === null) &&
            <li>
              <a href="#" onClick={()=>this.setState({status: 'delete'})}>Remove</a>
            </li>
          }

          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === 'delete') &&
          <li className={`action-${this.state.status}`}>
            Are you sure? <a href="#" className="delete" onClick={this.removeComment.bind(this)}>Yes</a> <a href="#" className="cancel" onClick={()=>this.setState({status: null})}>Cancel</a>
          </li>
          }

          { (this.props.currentUser.id === this.props.comment.user.id && this.state.status === 'deleting') &&
          <li className={`action-${this.state.status}`}>
            Deleting...
          </li>
          }

          <li>
            <NavLink to={`${this.props.router.location.pathname}/report?comment=${this.props.comment.id}`}>Report this Comment</NavLink>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewComment);
