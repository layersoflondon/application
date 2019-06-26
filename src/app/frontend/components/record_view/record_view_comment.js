import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import RecordViewGalleryMediaItem from './record_view_media_list_item';
import RecordViewComponentState from "./record_view_component_state";
import {NavLink} from 'react-router-dom';

@inject('router')
@observer class RecordViewComment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="m-records-comment">
      <p>Comment: <strong>{this.props.comment.content}</strong></p>
      <p>User: <strong>{this.props.comment.user.name}</strong></p>
      <p>Date: <strong>{this.props.comment.datetime}</strong></p>

      <div className="comment-actions">
        <ul>
          <li>
            <NavLink to={`${this.props.router.location.pathname}/report`}>Report this Comment</NavLink>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewComment);
