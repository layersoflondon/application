import React, {Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer, inject} from "mobx-react";
import TagGroup from '../tag_groups/tag_group';

@observer
class RecordTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: this.props.recordFormStore.record,
      tagGroups: null
    }

    this.setVisibleTagGroup = (id) => this.props.recordFormStore.setVisibleTagGroup(id);
    this.toggleTag = (id) => this.props.recordFormStore.toggleTag(id);
    this.tagIsChecked = (id) => this.props.recordFormStore.tagIsChecked(id);
  }

  componentWillReceiveProps() {
    this.setState({record: this.props.recordFormStore.record})
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane === 'tags' ? 'block' : 'none'};
    let pane_classname = (this.props.recordFormStore.visible_pane === 'tags') ? 'is-open' : '';

    if(!this.props.recordFormStore.record.id) {
      pane_classname = `${pane_classname} is-disabled`;
    }
    
    const title = "Tag this record";

    const tag_groups = this.props.tagGroupsStore.tag_groups.values().map((group, i) => {
      const tag_ids = group.tags.map((tag) => tag.id);
      const enabled_tag_ids = this.props.recordFormStore.record.tag_ids.filter((tag_id) => tag_ids.indexOf(tag_id) > -1);
      const isVisible = this.props.recordFormStore.visible_tag_group === group.id;
      return <TagGroup
        key={`tagGroup-${i}`}
        tagGroup={group}
        isVisible={isVisible}
        enabledTagIds={enabled_tag_ids} {...this.props}
        toggleTag={this.toggleTag}
        tagIsChecked={this.tagIsChecked}
        setVisibleTagGroup={this.setVisibleTagGroup}
      />;
    });

    return (
      <div className={`section section--add-tags ${pane_classname}`}>
        <h2 className="title" data-name="tags" onClick={this.togglePaneVisibility}>{title}</h2>

        <div className="pane" style={pane_styles}>
          <div className="m-tag-groups">
            <div class="parent-tags">
              {tag_groups}
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(RecordTags);
