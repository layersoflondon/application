import React,{Component} from 'react';
import RecordFormComponentState from '../records/record_form_component_state';
import {observer} from "mobx-react";
import Tag from './tag';
import PropTypes from 'prop-types';
import CollectionPicker from "../../collection_picker";

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
    this.props.setTagGroupVisibility(tagGroupId);
  }

  selectionButton = () => {
    let selectionLabel = "";
    let selectionButton;

    if(this.props.allTagsChecked) {
      selectionLabel = "Clear all";
      selectionButton = <span onClick={this.props.clearSelectedTags}>{selectionLabel}</span>;
    }else if(this.props.enabledTagIds.length>0) {
      selectionLabel = "Clear";
      selectionButton = <span onClick={this.props.clearSelectedTags}>{selectionLabel}</span>
    }else {
      selectionLabel = "Select all";
      selectionButton = <span onClick={this.props.selectAllTags}>{selectionLabel}</span>
    }

    return selectionButton;
  };

  render() {
    const toggleInput = (event) => {
      const added = this.props.toggleTag(event.currentTarget.id);

      let count = this.state.count;
      const new_count = added ? count+=1 : count-=1;

      this.setState({count: new_count});
    };

    const tags = this.props.tagGroup.tags.map((tag, i) => <Tag key={`tag-${i}`} {...tag} tagIsChecked={this.props.tagIsChecked(tag.id)} inputClicked={toggleInput} />);

    return <div className="parent-tag">
      <h4 data-tag-group-id={this.props.tagGroup.id} onClick={this.toggleVisibility.bind(this)}>
        {this.props.tagGroup.name}

        {this.props.enabledTagIds.length>0 &&
          <span className="tag-group-count">{this.props.enabledTagIds.length}</span>
        }
      </h4>

      <div className={`child-tags ${this.props.isVisible ? 'is-visible' : ''}`}>
        <div className="spike"></div>

        <span>{this.selectionButton()}</span>

        { this.props.isVisible &&
          <ul>
            {tags}
          </ul>
        }
      </div>
    </div>
  }
}

TagGroup.propTypes = {
  allTagsChecked: PropTypes.bool.isRequired,
  selectAllTags: PropTypes.func.isRequired,
  clearSelectedTags: PropTypes.func.isRequired,
};

export default RecordFormComponentState.bindComponent(TagGroup);
