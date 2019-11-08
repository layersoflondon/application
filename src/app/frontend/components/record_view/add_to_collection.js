import React,{Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import CollectionPicker from "../collection_picker";
import {inject, observer} from 'mobx-react';
import {removeModal} from '../../helpers/modals';

@inject('trayViewStore', 'mapViewStore', 'router')
@observer export default class AddToCollection extends Component {

  constructor(props) {
    super(props);
  }

  handleCloseOnClick(event) {
    event.preventDefault();

    const path = removeModal(this.props.router.location, 'addToCollection', this.props.mapViewStore);
    this.props.router.push(`/map?${path}`);
  }

  render() {
    if(!this.props.trayViewStore.record || !this.props.mapViewStore.addToCollectionModal) return <React.Fragment />

    return <Fragment>
      <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
        <div className="close">
          {this.props.trayViewStore.record &&
          <Link to={`/map?record=${this.props.trayViewStore.record.id}`} onClick={this.handleCloseOnClick.bind(this)}>Close</Link>}
        </div>

        <div className="m-add-other-record-to-collection">
          <h1>Add to a collection</h1>

          <div className="form form--chunky">
            {this.props.trayViewStore.record && 
              <CollectionPicker record={this.props.trayViewStore.record} />
            }
            <div className="form-actions">
              <div className="primary-actions">
                {this.props.trayViewStore.record &&
                <Link to={`/map?record=${this.props.trayViewStore.record.id}`} onClick={this.handleCloseOnClick.bind(this)}>Done</Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  }
}
