import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer} from 'mobx-react';

class FoundPlaces extends Component {
  selectAddress(event) {
    const chosen_place = this.props.places[event.target.dataset.placeIndex];

    this.props.recordFormStore.record.lat = chosen_place.geometry.location.lat;
    this.props.recordFormStore.record.lng = chosen_place.geometry.location.lng;
  }

  render() {
    const places = this.props.places.length>5 ? this.props.places.slice(0, 4) : this.props.places;
    return <select name="" id="">
      {this.props.places.map((place, index) => <option key={index} data-place-index={index} onClick={this.selectAddress.bind(this)}>{place.formatted_address}</option>)}
    </select>
  }
}

@observer class Details extends Component {
  constructor(props) {
    super(props);

    // this.state = {in_edit_mode: false}
  }

  render() {
    // const edit = this.state.in_edit_mode ? <span></span> : <span><a onClick={()=>this.setState({in_edit_mode: true})}>edit</a></span>

    return (
      <div className="form-group">
        {this.props.recordFormStore.place_lookup_status === true && this.props.recordFormStore.record.location === null &&
          <span className="location">Finding location...</span>
        }

        {this.state.in_edit_mode && <FoundPlaces places={this.props.recordFormStore.found_places} recordFormStore={this.props.recordFormStore} />}

        {this.props.recordFormStore.place_lookup_status === 200 && this.props.recordFormStore.record.location &&
          <span className="location">
            Place: {this.props.recordFormStore.record.location.address} | {this.props.recordFormStore.record.lat.toFixed(3)}, {this.props.recordFormStore.record.lng.toFixed(3)}
            {/*{edit}*/}
          </span>
        }
      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Details);
