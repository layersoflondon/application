import {observe} from 'mobx'
import {inject, observer} from "mobx-react";
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Record from "../sources/record";
import CollectionModel from "../models/collection";
import Collection from "../sources/collection";
import RecordModel from "../models/record";

// This component receives

@inject('collectionStore', 'currentUser')
@observer export default class CollectionPicker extends Component {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.state = {
      showing: 'user_collections',
      enabled_user_collections: this.props.record.user_collections,
      enabled_everyone_collections: this.props.record.everyone_collections,
      record: this.props.record,
      collections: []
    };
   
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

  componentWillReceiveProps() {
    window.record = this.props.record;

    this.setState({
      enabled_user_collections: this.props.record.user_collections,
      enabled_everyone_collections: this.props.record.everyone_collections,
      record: this.props.record
    });

  }

  handleShowCollectionsOnChange(event) {
    let collection_set = (event.target.checked) ? "everyone_collections" : "user_collections";
    // this.selectRef.current.select.setValue(this.props.collectionStore[collection_set].map(()));
    this.setState({showing: collection_set});
  }

  handleSelectOnChange(option, event) {
    let {action} = event;
    // when the select option changes, we need to add it to the list of collection ids for the record and remove it from the select

    //
    let updated_collections = this.state[`enabled_${this.state.showing}`].slice();
    if( action === 'select-option' ) {
      if(updated_collections.indexOf(option.value)<0) {
        updated_collections.push(option.value);
        this.state.record.collection_ids = updated_collections;
      }
    }

    this.setState({[`enabled_${this.state.showing}`] : updated_collections});

    

    // don't need to run this code if the select options are just being switched between personal and everyone collections

    // console.log(action);
    // if (action !== 'set-value') {
    //
    //   let updated_collections = this.state[`enabled_${this.state.showing}`].slice();
    //   let collection_ids = this.state.record.collection_ids.slice();
    //
    //   if( action === 'clear' ) {
    //     updated_collections = [];
    //   }else if( action === 'remove-value' ) {
    //     const removed_collections = updated_collections.filter((c) => options.indexOf(c)<0);
    //     const removed_collection_ids = removed_collections.map((c) => c.value);
    //
    //     collection_ids = collection_ids.filter((i) => removed_collection_ids.indexOf(i)<0);
    //     updated_collections = options;
    //   }else if( action === 'select-option' ) {
    //     console.log(options);
    //     options.map((option) => {
    //       if(updated_collections.indexOf(option)<0) {
    //         updated_collections.push(option);
    //         collection_ids.push(option.value);
    //       }
    //     });
    //
    //   }
    //
    //   this.state.record.collection_ids = collection_ids;
    //   this.setState({[`enabled_${this.state.showing}`] : updated_collections});
    // }
  }

  removeFromCollections(event) {
    event.preventDefault();
    let {value, name} = event.target;

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
    const collection_options = this.props.collectionStore[this.state.showing].values().map((c) => ({value: c.id, label: c.title}));

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

        <Select placeholder='' options={collection_options} hideSelectedOptions={true} isMulti={false} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef}/>

      </div>

      {(this.state.enabled_user_collections.length>0 || this.state.enabled_everyone_collections.length>0) && (

        <div className="m-record-belongs-to-collections">
          <h3>This record belongs to:</h3>

          {this.state.enabled_user_collections.length>0 && (
            <div className="belongs-to">
              <h4>Your collections</h4>

              {this.state.enabled_user_collections.map((c, i) => (
                <button className='m-record-collection-button' value={c.id} name='user_collections'
                        onClick={this.removeFromCollections.bind(this)} key={`user_collections_${i}`}>
                  {c.title}
                </button>
              ))}
            </div>
          )}

          {this.state.enabled_everyone_collections.length>0 && (
            <div className="belongs-to">
              <h4>Public (& other users') collections</h4>

              {this.state.enabled_everyone_collections.map((c, i) => (
                <button className='m-record-collection-button' value={c.value} name='everyone_collections' onClick={this.removeFromCollections.bind(this)} key={`everyone_collections_${i}`}>
                  {c.label}
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

