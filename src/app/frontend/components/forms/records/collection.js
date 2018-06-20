import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';

import Dropzone from 'react-dropzone';
import {observer} from "mobx-react";

@observer class Collection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};

    let creator_collection_options, everyone_collection_options = <p>
      No collections available
    </p>;

    // todo - make this work for all collection types...
    if( this.props.collectionStore.creator_collections.size > 0 ) {
      const options = this.props.collectionStore.creator_collections.values().map((c) => {
        return <option key={c.id} value={c.id}>{c.title}</option>
      });

      creator_collection_options = <div>
        Your Collections
        <select name="_collection_ids" onChange={this.handleOnChange}>
          <option defaultChecked={true}>Choose</option>
          {options}
        </select>
      </div>
    }else {
      creator_collection_options = <p>You haven't created any collections</p>
    }

    if( this.props.collectionStore.everyone_collections.size > 0 ) {
      const options = this.props.collectionStore.everyone_collections.values().map((c) => {
        return <option key={c.id} value={c.id}>{c.title}</option>
      });

      everyone_collection_options = <div>
        Public collections
        <select name="_collection_ids" onChange={this.handleOnChange}>
          <option defaultChecked={true}>Choose</option>
          {options}
        </select>
      </div>
    }else {
      everyone_collection_options = <p>You haven't created any collections</p>
    }

    return (
      <div className="section">
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>Add to a collection</h2>

        <div className="pane" style={pane_styles}>
          {creator_collection_options}
          {everyone_collection_options}
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Collection);
