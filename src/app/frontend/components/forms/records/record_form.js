import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import Details from './details';
import Dates from './dates';
import Media from './media';
import Collection from './collection';
import RecordModel from './../../../models/record';

@inject('mapViewStore', 'recordFormStore', 'trayViewStore', 'collectionStore')
@observer export default class RecordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {errors: []};
  }

  handleClickedOnSave(event) {
    event.preventDefault();
    // when successfully updating a Record, we should propagate the updated data throughout the stores that are rendering it.
    // since the tray and map render their data from a CardStore, we can just overwrite the data there (see insertOrUpdateRecord)
    this.props.recordFormStore.record.persist().then((response) => {
      const record = RecordModel.fromJS(response.data);

      this.props.recordFormStore.record.id = response.data.id;
      this.props.trayViewStore.tray_is_visible = true;
      this.props.trayViewStore.card_store.insertOrUpdateRecord(record);
      this.props.mapViewStore.overlay = null;

      this.props.recordFormStore.record.resetState();
    }).catch((response) => {
      console.log("Error Response: ", response);
    })
  }

  handleClickedOnClose(event) {
    event.preventDefault();

    this.props.mapViewStore.overlay = null;
    this.props.recordFormStore.record.resetState();
  }

  renders() {
    console.log("Rendering record form store", this.props);
    return <div>
      record form store
    </div>
  }
  render() {
    console.log("Rendering record form store", this.props, this);

    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'record_form' ) className+=" is-showing";

    return (
      <div className={className}>
        <div className="s-overlay--add-record is-showing">
          <div className="close">
            <Link className="close" to='/map'>Close</Link>
          </div>

          <div className="m-add-record">
            <h1>Add record</h1>

            <form action="" className="form--chunky form--over-white">
              <Dates   {...this.props} />
              <Details {...this.props} />

              <div className="m-accordion">
                <Media {...this.props} />
                {/*<Links {...this.props} />*/}
                <Collection {...this.props} />
                {/*<Team {...this.props} />*/}
              </div>

              <input type="submit" onClick={this.handleClickedOnSave.bind(this)} value="Save" />

            </form>
          </div>
        </div>
      </div>
    );
  }
}
