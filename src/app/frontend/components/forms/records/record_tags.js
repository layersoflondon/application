import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from "mobx-react";
import TagGroup from './tag_group';

import axios from 'axios';

@observer class RecordTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: this.props.recordFormStore.record,
      tagGroups: null
    }
  }

  componentWillReceiveProps() {
    this.setState({record: this.props.recordFormStore.record})
  }

  componentDidMount() {
    axios.get('/tag_groups').then((response) => {
      console.log("Setting tagGroups: ", response.data);
      this.setState({tagGroups: response.data});
    });
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='tags' ? 'block' : 'none'};
    let   pane_classname = (this.props.recordFormStore.visible_pane==='tags') ? 'is-open' : '';
    const title = "Tag this record";

    let tag_groups;
    if( this.state.tagGroups ) {
      tag_groups = this.state.tagGroups.map((group, i) => <TagGroup key={`tagGroup-${i}`} {...this.props} tagGroup={group} />)
    }else {
      pane_classname + ' is-loading';
    }

    return (
        <div className={`section section--add-tags ${pane_classname}`}>
          <h2 className="title" data-name="tags" onClick={this.togglePaneVisibility}>{title}</h2>

          <div className="pane" style={pane_styles}>
            <div className="m-tag-groups">
              {tag_groups}
            </div>
          </div>

        </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(RecordTags);
