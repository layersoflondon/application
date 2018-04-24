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

    let collection_options = <p>
      No collections available
    </p>;

    // todo - make this work for all collection types. use the _collections attribute
    if( this.props.collectionStore.creator_collections.length > 0 ) {
      const options = this.props.collectionStore.creator_collections.map((c) => {
        return <option key={c.id} value={c.id}>{c.title}</option>
      });

      collection_options = <select name="" id="">{options}</select>
    }

    return (
      <div className="section">
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>Add to a collection</h2>

        <div className="pane" style={pane_styles}>
          {collection_options}
        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(Collection);
