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

    // Get 2 lists of collections to populate the dropdowns



  }

  componentWillUnmount() {
    this.observerDisposer();
  }

  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='collection') ? 'is-open' : '';
    const title = (this.props.recordFormStore.record.collection_ids.length) ? 'Manage collections' : 'Add to collections';

    return (
      <div className={`section section--add-to-collection ${pane_classname}`}>
        <h2 className="title" data-name="collection" onClick={this.togglePaneVisibility}>{title}</h2>

        <div className="pane" style={pane_styles}>
          <CollectionPicker record={this.state.record}/>


        </div>

      </div>
    )
  }
}

export default RecordFormComponentState.bindComponent(CollectionsEditor);
