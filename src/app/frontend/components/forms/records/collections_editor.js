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

  componentWillReceiveProps() {
    this.setState({record: this.props.recordFormStore.record})
  }


  render() {
    const pane_styles = {display: this.props.recordFormStore.visible_pane==='collection' ? 'block' : 'none'};
    const pane_classname = (this.props.recordFormStore.visible_pane==='collection') ? 'is-open' : '';
    const title = ((this.state.record.collection_ids || []).length) ? 'Manage collections' : 'Add to collections';

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
