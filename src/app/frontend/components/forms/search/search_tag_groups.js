import {inject, observer} from "mobx-react";
import {withRouter} from "react-router-dom";
import React, {Component} from "react";
import TagGroup from "../tag_groups/tag_group";
import TagsStore from "../../../stores/tags_store";
import tags from "../../tray/tags";

@inject('router', 'tagGroupsStore')
@withRouter
@observer export default class SearchTagGroups extends Component {
  constructor(props) {
    super(props);

    const search = queryString.parse(this.props.router.location.search, {arrayFormat: 'comma'});
    this.tagIds = [];
    if (search.tag_ids) {
      this.tagIds = search.tag_ids.split(',').map((id) => parseInt(id, 10)).sort();
    }

    this.state = {
      visibleTagGroup: null
    };

    this.toggleTagGroup = (id) => {
      let value = parseInt(id, 10);

      if (this.state.visibleTagGroup === value) {
        value = null;
        document.querySelector("[class^='s-overlay']").removeEventListener('click', this.closeEventHandler);
      } else {
        document.querySelector("[class^='s-overlay']").addEventListener('click', this.closeEventHandler);
      }

      this.setState({visibleTagGroup: value});
    };

    this.closeEventHandler = (event) => {
      if (event.target.classList.contains('s-overlay--search')) {
        this.setState({visibleTagGroup: null});
      }
    };
  }

  render() {
    return <React.Fragment>
      <div className="filter-by-tag">
        <h2>Tags</h2>
        <div className="parent-tags">
          {this.props.tagGroupsStore.tag_groups.values().map((tagGroup) => {
            const tagsStore = new TagsStore(tagGroup, this.tagIds);

            return <TagGroup
                key={`tag-group-${tagGroup.id}`}
                tagsStore={tagsStore}
                tagGroup={tagGroup}
                isVisible={this.state.visibleTagGroup === tagGroup.id}
                enabledTagIds={tagsStore.checkedTagIds}
                toggleTag={tagsStore.toggleTag}
                tagIsChecked={tagsStore.tagIsChecked}
                setTagGroupVisibility={this.toggleTagGroup}
                allTagsChecked={tagsStore.allTagsChecked}
                selectAllTags={tagsStore.selectAll}
                clearSelectedTags={() => tagsStore.clearAll}
            />
          })}
        </div>
      </div>
    </React.Fragment>
  }
}
