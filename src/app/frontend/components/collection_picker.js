import {observe} from 'mobx'
import {inject, observer} from "mobx-react";
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Record from "../sources/record";
import CollectionModel from "../models/collection";
import Collection from "../sources/collection";
import RecordModel from "../models/record";

// This component receives a record prop and mutates the collection IDs on it, which are observed in the RecordModel and persisted from there.

@inject('collectionStore', 'currentUser')
@observer export default class CollectionPicker extends Component {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.state = {
      showing: 'user_collections',
      collections: [],
      record: this.props.record,
      enabled_user_collections: [],
      enabled_everyone_collections: []
    };

    // this.state = Object.assign(this.state, this.getCollectionsState(props));
   
  }

  componentWillMount() {

    // Get a list of all collections owned by this user, and by others (which are allowed to be added to)
      //the API returns all collections except those owned by the user.
    Collection.writable_by_everyone().then((response) => {
      response.data.map((c) => {
        let collection = CollectionModel.fromJS(c, this.props.trayViewStore, true, false);
        this.props.collectionStore.everyone_collections.set(collection.id, collection);

        return collection;
      });
    });

    Collection.owned_by_user(this.props.currentUser.id).then((response) => {
      response.data.map((c) => {
        let collection = CollectionModel.fromJS(c, this.props.trayViewStore, true, false);
        this.props.collectionStore.user_collections.set(collection.id, collection);

        return collection;
      });
    });

  }

  componentWillUnmount() {
    // this.observerDisposer();
  }

  componentWillReceiveProps(newProps) {
    this.setState({record: newProps.record});
    this.getSelectOptions();
  }

  getSelectOptions() {
    const user_collections_options = this.props.collectionStore.user_collections.values().filter((c) => {return this.state.record.user_collections.map((c) => c.id).indexOf(c.id) < 0});
    const everyone_collections_options = this.props.collectionStore.everyone_collections.values().filter((c) => {return this.state.record.everyone_collections.map((c) => c.id).indexOf(c.id) < 0});
    this.setState({
      user_collections_options: user_collections_options.map((c) => ({value: c.id, label: c.title})),
      everyone_collections_options: everyone_collections_options.map((c) => ({value: c.id, label: c.title}))
    })
    
  }

  handleShowCollectionsOnChange(event) {
    let collection_set = (event.target.checked) ? "everyone_collections" : "user_collections";
    this.setState({showing: collection_set});
  }

  handleSelectOnChange(option, event) {
    let {action} = event;

    // if a select option changes, we need to add the id to the records collection ids (which are observed in the RecordModel and persisted)
    if( action === 'select-option' ) {
      let current_collections = this.state.record.collection_ids.slice();
      if(current_collections.indexOf(option.value)<0) {
        current_collections.push(option.value);
        this.state.record.collection_ids = current_collections;
        this.getSelectOptions();
      }


    //  TODO remove the selected option from the list
    }

  }

  removeFromCollections(event) {
    event.preventDefault();
    let {value, name} = event.target;
    let current_collections = this.state.record.collection_ids.slice();
    this.state.record.collection_ids = current_collections.filter((c) => {return c !== parseInt(value,10)});
    this.getSelectOptions();

    // TODO add the entry back into the appropriate options

    // let updated_collections = this.state[`enabled_${name}`].slice();
    // const removed = updated_collections.find((c) => c.value === parseInt(value, 10) );
    //
    // let index = updated_collections.indexOf(removed);
    // if( index>-1 ) {
    //   updated_collections.splice(index, 1);
    // }
    //
    // index = this.state.record.collection_ids.indexOf( parseInt(value, 10 ) );
    // if( index>-1 ) {
    //   const collection_ids = this.state.record.collection_ids.slice();
    //   collection_ids.splice(index, 1);
    //   this.state.record.collection_ids = collection_ids;
    // }
    //
    // this.setState({[`enabled_${name}`]: updated_collections});
    //
    // if( this.state.showing === name ) {
    //   setTimeout(() => {
    //     this.selectRef.current.select.setValue(updated_collections);
    //   }, 1);
    // }
  }

  render() {


    const toggled_classname = (this.state.showing === "user_collections") ? "" : "is-toggled";
    const collection_options = this.state[`${this.state.showing}_options`];

    return  <div className="m-add-to-collection">

      <div className="form">

        <div className={`form-group form-group--toggle-switch ${toggled_classname}`}>
          <label>
            <span>Your collections</span>
            <input type="checkbox" name='showing_collections' checked={this.state.showing === 'everyone_collections'} onChange={this.handleShowCollectionsOnChange.bind(this)}/>
            <span className="toggle"></span>
            <span>Public collections</span>
          </label>
        </div>

        <Select placeholder='' options={collection_options} value="" isMulti={false} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef}/>

      </div>

      {(this.state.record.user_collections.length>0 || this.state.record.everyone_collections.length>0) && (

        <div className="m-record-belongs-to-collections">
          <h3>This record belongs to:</h3>

          {this.state.record.user_collections.length>0 && (
            <div className="belongs-to">
              <h4>Your collections</h4>

              {this.state.record.user_collections.map((c, i) => (
                <button className='m-record-collection-button' value={c.id} name='user_collections'
                        onClick={this.removeFromCollections.bind(this)} key={`user_collections_${i}`}>
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {this.state.record.everyone_collections.length>0 && (
            <div className="belongs-to">
              <h4>Other public collections</h4>

              {this.state.record.everyone_collections.map((c, i) => (
                
                <button className='m-record-collection-button' value={c.id} name='everyone_collections' onClick={this.removeFromCollections.bind(this)} key={`everyone_collections_${i}`}>
                  {c.title}
                </button>
              ))}
            </div>
          )}

        </div>

      )}

    </div>
  }

}

CollectionPicker.propTypes = {
  record: PropTypes.object.isRequired
};

