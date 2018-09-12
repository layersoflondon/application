import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import Collection from '../../../sources/collection';
import CollectionModel from '../../../models/collection';
import CollectionPicker from '../../collection_picker';

import {observe} from "mobx";
import {observer} from "mobx-react";

@observer class CollectionsEditor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      record: this.props.recordFormStore.record
    }
  }

  componentWillMount() {

    // the component is mounted before the record is loaded from the api; a new record is created with the results of the GET request
    // so we need to observe the record itself and update the description if necessary.
    this.observerDisposer = observe(this.props.recordFormStore, 'record', (changes) => {
      if (changes.newValue) {
        this.setState({record: changes.newValue})
      }
    });

    Collection.writable_by_everyone().then((response) => {
      response.data.map((c) => {
        let collection = CollectionModel.fromJS(c, this.props.trayViewStore, true, false);
        this.props.collectionStore.everyone_collections.set(collection.id, collection);

        return collection;
      });
    });
  }

  componentWillUnmount() {
    this.observerDisposer();
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='collection') ? 'is-open' : '';

    return (
      <div className={`section section--add-to-collection ${pane_classname}`}>
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>Add to a collection</h2>

        <div className="pane" style={pane_styles}>
          <CollectionPicker collections={this.props.collectionStore} everyone_collections={this.state.record.everyone_collections} user_collections={this.state.record.user_collections} record={this.state.record}/>


        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(CollectionsEditor);
