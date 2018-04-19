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
        {this.props.recordFormStore.place === null && this.props.recordFormStore.place_lookup_status === true && <span className="place">Lookup...</span>}
        {this.props.recordFormStore.place_lookup_status === 500 && <span className="place">Error looking up...</span>}
        {this.props.recordFormStore.place && this.props.recordFormStore.place_lookup_status === true && <span className="place">Place: {this.props.recordFormStore.place}</span>}
      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Details);
