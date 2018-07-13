import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewGalleryMediaItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props.media.url);

    return <div>
      <img src={this.props.media.url} alt=""/>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewGalleryMediaItem);
