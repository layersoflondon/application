import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';

@observer class RecordViewRelatedRecord extends Component {
  containerClasses() {
    const number = this.props.record.attributes.title.split('').map((c) => {return c.charCodeAt() }).reduce((a,b) => a + b, 0) % 10;
    if (this.props.record.image) {
      return "";
    } else {
      return `m-record-card placeholder-${number}`;
    }
  }

  render() {
    return <div className={this.containerClasses()}>
      <Link to={`/map/records/${this.props.record.attributes.id}`}>
        <div className="wrapper">
          <div className="text-content">
            <h1>
              {this.props.record.attributes.title}
            </h1>
            <p dangerouslySetInnerHTML={{__html: this.props.record.excerpt}}>
            </p>
          </div>

          <div className="link-indicator"></div>
        </div>
      </Link>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewRelatedRecord);
