import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";
import Tag from './tag';

@observer class TagGroup extends Component {
  constructor(props) {
    super(props);

    const tag_ids = props.tagGroup.tags.map((tag) => tag.id);
    const enabled_tag_ids = this.props.recordFormStore.record.tag_ids.filter((tag_id) => tag_ids.indexOf(tag_id)>-1);

    this.state = {
      visible: false,
      count: enabled_tag_ids.length
    };

    this.tag = (props) => <li key={`tag-${props.id}`}>{props.name}</li>
  }

  toggleVisibility(event) {
    const {tagGroupId} = event.target.dataset;
    this.props.recordFormStore.setVisibleTagGroup(tagGroupId);
  }

  render() {
    const toggleInput = (event) => {
      const added = this.props.recordFormStore.toggleTag(event.currentTarget.id);

      let count = this.state.count;
      const new_count = added ? count+=1 : count-=1;

      this.setState({count: new_count});
    };

    const tags = this.props.tagGroup.tags.map((tag, i) => <Tag key={`tag-${i}`} {...tag} isChecked={this.props.recordFormStore.tagIsChecked(tag.id)} inputClicked={toggleInput} />);
    const visible = this.props.recordFormStore.visible_tag_group === this.props.tagGroup.id;

    return <div className="tag-group">
      <h4 data-tag-group-id={this.props.tagGroup.id} onClick={this.toggleVisibility.bind(this)}>
        {this.props.tagGroup.name}

        {this.state.count>0 &&
          <span className="tag-group-count">{this.state.count}</span>
        }
      </h4>

      <div className="tags">
        { visible &&
          <ul>
            {tags}
          </ul>
        }

        { visible &&
          <button onClick={this.toggleVisibility.bind(this)}>Done</button>
        }
      </div>
    </div>
  }
}

export default RecordFormComponentState.bindComponent(TagGroup);
