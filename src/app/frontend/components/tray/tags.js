import React,{Component} from 'react';
import TrayTagGroup from './tag_group';
import { inject } from 'mobx-react';

@inject('tagGroupsStore')
export default class TrayTags extends Component {
  render() {
    return this.props.tagGroupsStore.tag_groups.values().map((tagGroup) => <TrayTagGroup key={`tag-group-${tagGroup.id}`} tagGroup={tagGroup} />)
  }
}
