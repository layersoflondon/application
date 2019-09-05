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

  render() {
    const toggleInput = (event) => {
      const added = this.props.recordFormStore.toggleTag(event.currentTarget.id);

      let count = this.state.count;
      const new_count = added ? count+=1 : count-=1;

      this.setState({count: new_count});
    };

    const tags = this.props.tagGroup.tags.map((tag, i) => <Tag key={`tag-${i}`} {...tag} isChecked={this.props.recordFormStore.tagIsChecked(tag.id)} inputClicked={toggleInput} />);

    return <div className="tag-group">
      <h4 onClick={() => this.setState({visible: !this.state.visible})}>
        {this.props.tagGroup.name}

        {this.state.count>0 &&
          <span className="tag-group-count">{this.state.count}</span>
        }
      </h4>

      <div className="tags">
        { this.state.visible &&
          <ul>
            {tags}
          </ul>
        }

        { this.state.visible &&
          <button onClick={() => this.setState({visible: !this.state.visible})}>Done</button>
        }
      </div>
    </div>
  }
}

export default RecordFormComponentState.bindComponent(TagGroup);
