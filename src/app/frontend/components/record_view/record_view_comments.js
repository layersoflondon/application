import React,{Component} from 'react';
import {observer} from "mobx-react";
import Comment from '../../sources/comment';
import RecordViewComment from './record_view_comment'
import {NavLink} from 'react-router-dom';

@observer
export default class RecordViewComments extends Component {
  constructor(props) {
    super(props);

    this.state = {loaded: false, comments: []};
  }

  componentWillMount() {
    Comment.index(this.props.record.id).then((response) => {
      this.setState({loaded: true, comments: response.data});
    });
  }

  render() {
    if( this.state.loaded ) {
      const comments = this.state.comments.map((comment, i) => <RecordViewComment key={`record-${this.props.record.id}-comment-${i}`} comment={comment} />);
      return <div>
        <h3>Comments</h3>
        {comments}
      </div>

    }else {
      return <span>...</span>
    }
  }
}
