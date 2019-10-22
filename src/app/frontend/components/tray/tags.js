import React,{Component} from 'react';
import TrayTagGroup from './tag_group';
import axios from 'axios';

export default class TrayTags extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios.get('/tag_groups').then((response) => {
      this.setState({tagGroups: response.data});
    });
  }

  render() {
    if(!this.state.tagGroups) return <React.Fragment />
    return this.state.tagGroups.map((tagGroup) => <TrayTagGroup key={`tag-group-${tagGroup.id}`} tagGroup={tagGroup} />)
  }
}
