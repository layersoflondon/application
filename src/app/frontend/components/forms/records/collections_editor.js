import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import Collection from '../../../sources/collection';
import CollectionModel from '../../../models/collection';

import Select from 'react-select'

import {observer, inject} from "mobx-react";

@observer class CollectionsEditor extends Component {
  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    this.state = {
      showing: 'user_collections',
      collections: [],
      enabled_user_collections: this.props.recordFormStore.record.user_collections,
      enabled_everyone_collections: this.props.recordFormStore.record.everyone_collections
    };
  }

  componentWillMount() {
    Collection.writable_by_everyone().then((response) => {
      response.data.map((c) => {
        let collection = CollectionModel.fromJS(c, this.props.trayViewStore, true, false);
        this.props.collectionStore.everyone_collections.set(collection.id, collection);

        return collection;
      });
    });
  }

  handleShowCollectionsOnChange(event) {
    let collection_set = (event.target.checked) ? "everyone_collections" : "user_collections";
    this.selectRef.current.select.setValue(this.state[`enabled_${collection_set}`]);
    this.setState({showing: collection_set});
  }

  handleSelectOnChange(options, event) {
    let {action} = event;

    let updated_collections = this.state[`enabled_${this.state.showing}`].slice();
    let collection_ids = this.props.recordFormStore.record.collection_ids.slice();

    if( action === 'clear' ) {
      updated_collections = [];
    }else if( action === 'remove-value' ) {
      const removed_collections = updated_collections.filter((c) => options.indexOf(c)<0);
      const removed_collection_ids = removed_collections.map((c) => c.value);

      collection_ids = collection_ids.filter((i) => removed_collection_ids.indexOf(i)<0);
      updated_collections = options;
    }else if( action === 'select-option' ) {
      options.map((option) => {
        if(updated_collections.indexOf(option)<0) {
          updated_collections.push(option);
          collection_ids.push(option.value);
        }
      });
    }

    this.props.recordFormStore.record.collection_ids = collection_ids;
    this.setState({[`enabled_${this.state.showing}`] : updated_collections});
  }

  removeFromCollections(event) {
    event.preventDefault();
    let {value, name} = event.target;

    let updated_collections = this.state[`enabled_${name}`].slice();
    const removed = updated_collections.find((c) => c.value === parseInt(value, 10) );

    let index = updated_collections.indexOf(removed);
    if( index>-1 ) {
      updated_collections.splice(index, 1);
    }

    index = this.props.recordFormStore.record.collection_ids.indexOf( parseInt(value, 10 ) );
    if( index>-1 ) {
      const collection_ids = this.props.recordFormStore.record.collection_ids.slice();
      collection_ids.splice(index, 1);
      this.props.recordFormStore.record.collection_ids = collection_ids;
    }

    this.setState({[`enabled_${name}`]: updated_collections});

    if( this.state.showing === name ) {
      setTimeout(() => {
        this.selectRef.current.select.setValue(updated_collections);
      }, 1);
    }
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='collection') ? 'is-open' : '';
    const toggled_classname = (this.state.showing === "user_collections") ? "" : "is-toggled";
    const collection_options = this.props.collectionStore[this.state.showing].values().map((c) => ({value: c.id, label: c.title}));

    return (
      <div className={`section section--add-to-collection ${pane_classname}`}>
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>Add to a collection</h2>

        <div className="pane" style={pane_styles}>

          <div className="m-add-to-collection">

            <div className="form">

            {/*
              <label htmlFor="">Your Collections
                <input type="radio" name='showing_collections' value={`user_collections`} checked={this.state.showing === 'user_collections'} onChange={this.handleShowCollectionsOnChange.bind(this)} />
              </label>

              <label htmlFor="">Public Collections
                <input type="radio" name='showing_collections' value={`everyone_collections`} checked={this.state.showing === 'everyone_collections'} onChange={this.handleShowCollectionsOnChange.bind(this)} />
              </label>
            */}

              <div className={`form-group form-group--toggle-switch ${toggled_classname}`}>
                <label>
                  <span>Your collections</span>
                  <input type="checkbox" name='showing_collections' checked={this.state.showing === 'everyone_collections'} onChange={this.handleShowCollectionsOnChange.bind(this)}/>
                  <span className="toggle"></span>
                  <span>Public collections</span>
                </label>
              </div>

              <Select placeholder='' options={collection_options} hideSelectedOptions={true} isMulti={true} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef}/>

            </div>

              {(this.state.enabled_user_collections.length>0 || this.state.enabled_everyone_collections.length>0) && (

                <div className="m-record-belongs-to-collections">
                    <h3>This record belongs to:</h3>

                    {this.state.enabled_user_collections.length>0 && (
                        <div className="belongs-to">
                          <h4>Your collections</h4>

                            {this.state.enabled_user_collections.map((c, i) => (
                                <button className='m-record-collection-button' value={c.value} name='user_collections'
                                        onClick={this.removeFromCollections.bind(this)} key={`user_collections_${i}`}>
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {this.state.enabled_everyone_collections.length>0 && (
                        <div className="belongs-to">
                          <h4>Public (& other user's collections)</h4>

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

        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(CollectionsEditor);
