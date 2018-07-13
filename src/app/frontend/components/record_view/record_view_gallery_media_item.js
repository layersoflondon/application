import React,{Component} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';

@observer class RecordViewGalleryMediaItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props.media.url);

    return <div className="">
      <img src={this.props.media.url} alt=""/>

      {this.props.showAttribution && <div className="attribution">{this.props.media.attribution}</div>}
      {this.props.showCaption && <div className="caption">{this.props.media.caption}</div>}
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewGalleryMediaItem);
