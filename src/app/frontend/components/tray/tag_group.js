import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class TrayTagGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};

    this.eventListener = null;
  }
  
  showTagGroup(event) {
    const visible = !this.state.visible;
    this.setState({visible: visible});

    this.eventListener = (event) => {
      this.setState({visible: false});
    }

    if(visible) {
      document.addEventListener('click', this.eventListener);
    }else {
      document.removeEventListener('click', this.eventListener);
    }
  }

  render() {
    return <div className="tag-group" key={`tag-group-${this.props.tagGroup.id}`}>
      <h4 data-tag-group-id={this.props.tagGroup.id} onClick={this.showTagGroup.bind(this)}>
        {this.props.tagGroup.name}
      </h4>

      {
        this.state.visible && 
        <div className={`tags is-visible`}>
          <div class="spike"></div>
          <ul>
            {this.props.tagGroup.tags.map((tag) => {
              return <li key={tag.id}>
                <Link to={`/map/search?show_results=true&tag_ids=${[tag.id]}`}>{tag.name}</Link>
              </li>
            })}
          </ul>
        </div>
      }
    </div>
  }
}
