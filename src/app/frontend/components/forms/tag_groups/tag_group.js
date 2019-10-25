import React,{Component} from 'react';
import RecordFormComponentState from '../records/record_form_component_state';
import {observer} from "mobx-react";
import Tag from './tag';

@observer class TagGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      count: this.props.enabledTagIds.length
    };

    this.tag = (props) => <li key={`tag-${props.id}`}>{props.name}</li>
  }

  toggleVisibility(event) {
    const {tagGroupId} = event.target.dataset;
    this.props.setVisibleTagGroup(tagGroupId);
  }

  render() {
    const toggleInput = (event) => {
      const added = this.props.toggleTag(event.currentTarget.id);

      let count = this.state.count;
      const new_count = added ? count+=1 : count-=1;

      this.setState({count: new_count});
    };

    const tags = this.props.tagGroup.tags.map((tag, i) => <Tag key={`tag-${i}`} {...tag} tagIsChecked={this.props.tagIsChecked(tag.id)} inputClicked={toggleInput} />);

    return <div className="tag-group">
      <h4 data-tag-group-id={this.props.tagGroup.id} onClick={this.toggleVisibility.bind(this)}>
        {this.props.tagGroup.name}

        {this.props.enabledTagIds.length>0 &&
          <span className="tag-group-count">{this.props.enabledTagIds.length}</span>
        }
      </h4>

      <div className={`tags ${this.props.isVisible ? 'is-visible' : ''}`}>
        <div className="spike"></div>
        { this.props.isVisible &&
          <ul>
            {tags}
          </ul>
        }
      </div>
    </div>
  }
}

export default RecordFormComponentState.bindComponent(TagGroup);
