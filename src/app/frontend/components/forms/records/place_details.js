import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from 'mobx-react';

@observer class Details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-group">
        {this.props.recordFormStore.place_lookup_status === true && this.props.recordFormStore.record.location === null &&
          <span className="location">Finding location...</span>
        }

        {this.props.recordFormStore.place_lookup_status === 200 && this.props.recordFormStore.record.location &&
          <span className="location">Place: {this.props.recordFormStore.record.location.address} | {this.props.recordFormStore.record.lat.toFixed(3)}, {this.props.recordFormStore.record.lng.toFixed(3)}</span>
        }
      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Details);
