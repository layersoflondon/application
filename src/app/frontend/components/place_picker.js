import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {debounce} from "underscore";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

@observer export default class PlacePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' }
  }

  handleChange(address) {
    this.setState({address: address});
  }

  handleSelect(address) {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  render() {
    const searchOptions = {
      location: new google.maps.LatLng(51, -0.1),
      radius: 500
    };

    return (
      <div className="m-place-picker is-showing">
        <div className="wrap">
          Pick a place to add a record or

          <PlacesAutocomplete value={this.state.address} onChange={this.handleChange.bind(this)} onSelect={this.handleSelect.bind(this)} searchOptions={searchOptions}>
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input'
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {suggestions.map(suggestion => {
                    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' };
                    return (
                      <div {...getSuggestionItemProps(suggestion, { className, style })}>
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>

        </div>
      </div>
    );
  }
}

PlacePicker.propTypes = {
};
