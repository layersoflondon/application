import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import Record from "../../sources/record";
import RecordViewRelatedRecord from "./record_view_related_record";

@observer class RecordViewRelated extends Component {
  constructor(props) {
    super(props);
    this.state = {status: 'loading'};
  }

  componentDidMount() {
    this.fetchRelatedRecords();
  }

  componentDidUpdate(oldProps) {
    if(this.props.record.id !== oldProps.record.id) {
      this.fetchRelatedRecords();
    }
  }

  fetchRelatedRecords() {
    Record.related(this.props.record.id).then((response) => {
      this.props.record.related = response.data;
      this.setState({status: 'loaded'});
    }).catch(() => {
      this.setState({status: 'loaded'});
    });
  }

  render() {
    if( this.state.status === 'loaded' ) {
      const cards = this.props.record.related.map((related_record, i) => {
        return <RecordViewRelatedRecord key={`related-${i}`} record={related_record} />
      });
      
      return <Fragment>
          <div className={`m-related related-records-count-${this.props.record.related.length}`}>
            {this.props.record.related.length>0 &&
              <h3>
                You may also like...
              </h3>
            }
            <div className="records-cards">
              {cards}
            </div>
          </div>
      </Fragment>
    }else {
      return <Fragment>
        <div className="m-related is-loading">
        </div>
      </Fragment>
    }
  }
}

export default RecordViewComponentState.bindComponent(RecordViewRelated);
