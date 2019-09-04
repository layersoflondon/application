import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewTags extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tags = this.props.trayViewStore.record.tag_groups.map((tag_group, i) => (
        tag_group.tags.map((tag, i) => (
            <li key={`tag-${tag.id}`}>
              {tag.name}
            </li>
        ))
    ));

    return <div className="tags">
      <h3>Tags</h3>
      <ul>{tags}</ul>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewTags);
