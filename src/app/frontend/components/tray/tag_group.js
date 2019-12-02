import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class TrayTagGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};

    this.eventListener = (event) => {
      if(parseInt(this.props.tagGroup.id, 10) !== parseInt(event.target.dataset.tagGroupId, 10)) {
        this.setState({visible: false});
      }
    }
  }

  showTagGroup(event) {
    const visible = !this.state.visible;
    this.setState({visible: visible});

    if (visible) {
      document.addEventListener('click', this.eventListener);
    } else {
      document.removeEventListener('click', this.eventListener);
    }
  }

  render() {
    const tags = this.props.tagGroup.tags.filter((tag) => {
      return tag.record_count>0;
    });

    return <div className="parent-tag" key={`tag-group-${this.props.tagGroup.id}`}>
      <h4 className="tag-group-name" data-tag-group-id={this.props.tagGroup.id} onClick={this.showTagGroup.bind(this)}>
        {this.props.tagGroup.name}
      </h4>

      {
        this.state.visible &&
        <div className={`child-tags is-visible`}>
          <div className="spike"></div>
          <ul>
            {tags.map((tag) => {
              return <li className="child-tag" key={tag.id}>
                <Link to={`/map/search?show_results=true&tag_ids=${[tag.id]}`}>{tag.name}</Link>
              </li>
            })}
          </ul>
        </div>
      }
    </div>
  }
}
