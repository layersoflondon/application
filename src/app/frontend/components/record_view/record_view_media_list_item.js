import React,{Component} from 'react';
import {observer} from "mobx-react";
import {Link} from 'react-router-dom';
import RecordViewComponentState from './record_view_component_state';
import Img from 'react-image';
import {appendQueryString} from '../../helpers/modals';

@observer class RecordViewMediaListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const image_attribute = this.props.record.view_type === 'gallery' ? 'card' : 'large';
    const path = appendQueryString(this.props.router.location, [{key: 'media', value: true}, {key: 'media-item-id', value: this.props.media.id}])

    return <div className={`media-item media-item--${this.props.media.media_type}`}>
      <Link to={`?${path}`}>
        <Img src={this.props.media.attachable[image_attribute]} alt="" loader={<span className="is-loading" /> }/>
        {this.props.record.view_type === 'expanded' && <div className="attribution" dangerouslySetInnerHTML={{__html: this.props.media.attribution}}></div>}
        {this.props.record.view_type === 'expanded' && <div className="caption" dangerouslySetInnerHTML={{__html: this.props.media.caption}}></div>}
      </Link>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewMediaListItem);
