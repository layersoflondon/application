import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {Link} from 'react-router-dom';
import Img from 'react-image';

@observer class RecordViewRelatedRecord extends Component {
  containerClasses() {
    const number = this.props.record.attributes.title.split('').map((c) => {return c.charCodeAt() }).reduce((a,b) => a + b, 0) % 10;
    if (this.props.record.attributes.image) {
      return "m-record-card";
    } else {
      return `m-record-card placeholder-${number}`;
    }
  }

  render() {
    return <div className={this.containerClasses()}>
      <Link to={`/map?record=${this.props.record.attributes.id}`} onClick={() => this.props.trayViewStore.record_id = this.props.record.id}>
        <div className="wrapper">
        {
            this.props.record.attributes.image &&
              <div className="image">
                {
                  <Fragment>
                    <Img src={this.props.record.attributes.image.card}/>
                  </Fragment>
                }
              </div>
          }
          <div className="text-content">
            <h1>
              {this.props.record.attributes.title}
            </h1>
            <p dangerouslySetInnerHTML={{__html: this.props.record.attributes.excerpt}}>
            </p>
          </div>

          <div className="link-indicator"></div>
        </div>
      </Link>
    </div>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewRelatedRecord);
