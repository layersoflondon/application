import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from "./record_view_component_state";

@observer class RecordViewTags extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let tags_data = [].concat(...stores.trayViewStore.record.tag_groups.map((tg) => tg.tags));
    tags_data = tags_data.filter((tag, index, array) => array.indexOf(tag) === index); //unique array of tags

    const tags = tags_data.map((tag, i) => (
        <li key={`tag-${tag.id}`}>
              <span>
                <a href={`/map/search?show_results=true&tag_ids=${[tag.id]}`}>{tag.name}</a>
              </span>
        </li>
    ));

    return <div className="tags">
      <h3>Tags</h3>
      <ul>{tags}</ul>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewTags);
