import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {Redirect} from 'react-router';
import Details from './details';
import Credits from './credits'
import Location from './location'
import Dates from './dates';
import Media from './media';
import Links from './links';
import CollectionsEditor from './collections_editor';
import RecordTags from './record_tags';
import TeamPicker from './team_picker';
import Record from './../../../sources/record';
import RecordModel from './../../../models/record';
import NotFound from "../../not_found";
import {Link} from 'react-router-dom';
import {closeModalLink, getQueryStringParam} from '../../../helpers/modals';

@inject('router', 'mapViewStore', 'recordFormStore', 'trayViewStore', 'collectionStore', 'tagGroupsStore', 'currentUser')
@observer export default class RecordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {errors: [], loadingError: false};
    this.fetchRecord = (id) => {
      Record.show(null, id).then((response) => {
        this.props.mapViewStore.inEditRecordMode = true;
        this.props.recordFormStore.record = RecordModel.fromJS(response.data);
      });
    }
  }

  componentWillUpdate() {
    const record_id = getQueryStringParam(this.props.router.location, 'editRecord');
    
    if(record_id && !this.props.recordFormStore.record.id) {
      this.fetchRecord(record_id);
    }
  }

  componentWillMount() {
    const record_id = getQueryStringParam(this.props.router.location, 'editRecord');
    
    if(record_id) {
      this.fetchRecord(record_id);
    }
  }

  createDraftRecord() {
    if (!this.props.recordFormStore.record.id) {
      this.props.recordFormStore.record.persist().then((response) => {
        this.props.recordFormStore.record = RecordModel.fromJS(response.data);

        // fixme - find a better way to do this. the stubbed out video
        // attachment needs to know the record id we've just been given...
        this.props.recordFormStore.record.videos.map((v, i) => {
          if( !v.record_id ) {
            v.record_id = response.data.id;
          }
        });
      }).catch((error) => {
        this.props.recordFormStore.record.errors = error.response.data;
      });
    }
  }

  handleClickedOnSave(event) {
    event.preventDefault();
    // when successfully updating a Record, we should propagate the updated data throughout the stores that are
    // rendering it. since the tray and map render their data from the trayViewStore.mainResults observable, we can just
    // overwrite the data there (see addOrUpdateRecord)
    const {state} = event.target.dataset;

    this.props.recordFormStore.record.state = state;

    this.props.recordFormStore.record.persist().then((response) => {
      let card = this.props.trayViewStore.addOrUpdateRecord(response.data);

      card = this.props.trayViewStore.mainResults.get(card.id);
      this.props.trayViewStore.record = card.data;
      this.props.trayViewStore.tray_is_visible = true;

      const {push} = {...this.props.router};

      this.props.mapViewStore.inEditRecordMode = false;
      push(`/map?record=${card.data.id}`);

      this.props.recordFormStore.record = new RecordModel();
    }).catch((error) => {
      console.log(error)
      this.props.recordFormStore.record.errors = error.response.data;
    })
  }

  handleStateChange(event) {
    event.preventDefault();
    const {state} = event.target.dataset;
    let message = "";
    switch(state) {
      case "deleted":
        message = "Really delete this record?";
        break;
      case "draft":
        message = "Make this record draft?";
        break;
      case "published":
        message = "Publish this record?";
        break;
    }

    if (window.confirm(message)) {
      let r = Record.update(null, this.props.recordFormStore.record.id, {record: {state: state}}).then((response) => {
        if( state === 'deleted' ) {
          this.props.trayViewStore.mainResults.delete(`record_${this.props.recordFormStore.record.id}`);
          this.props.recordFormStore.record = new RecordModel();

          if (this.props.router.history.previousLocalStates > 1) {
            this.props.router.go(-2);
          }else {
            this.props.router.push('/map');
          }
        }

        this.props.recordFormStore.record.state = state;
      });
    }
  }

  handleCloseOnClick(event) {
    event.preventDefault();
    this.props.recordFormStore.record = new RecordModel();
    
    const url = closeModalLink(this.props.router.location, ['newRecord', 'editRecord']);
    this.props.router.push(url);

    this.props.mapViewStore.inEditRecordMode = false;
  }

  render() {
    if (this.state.loadingError) {
      return <NotFound/>
    }

    if(!this.props.mapViewStore.inEditRecordMode || this.props.mapViewStore.inChoosePlaceMode) {
      return <React.Fragment />
    }
    
    if( this.props.recordFormStore.record.id && !this.props.recordFormStore.record.user_can_edit_record ) {
      return <div className='m-overlay'>
        <div className="close">
          <Link to={closeModalLink(this.props.router.location, ['newRecord', 'editRecord'])} className="close" onClick={this.handleCloseOnClick.bind(this)}></Link>
        </div>

        <div className="m-add-record">
          <h1>Not allowed</h1>

          <p>
            You don't have permission to edit this record.
          </p>
        </div>
      </div>
    }

    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'record_form' ) className+=" is-showing";

    let form_title = this.props.recordFormStore.record.has_autogenerated_title ? "Add record" : "Edit record";

    const publishingErrors = Object.entries(this.props.recordFormStore.record.errors_on_publishing).map((e) => {
      const fieldName = e[0];
      return e[1].map((message,i) => {
        const key = `${fieldName}-${i}`;
        return <li key={key}>{message}</li>;
      });
    });

    return (
      <div className={className}>
        <div className="s-overlay--add-record is-showing">
          <div className="close">
            <Link to={closeModalLink(this.props.router.location, ['newRecord', 'editRecord'])} className="close" onClick={this.handleCloseOnClick.bind(this)}></Link>
          </div>

          <div className="m-add-record">
            <h1>{form_title}</h1>

            <form action="" className="form--chunky form--over-white">
              <Dates   {...this.props} />
              <Details {...this.props} />
              <Location {...this.props} />
              <Credits {...this.props} />

              <div className="m-accordion">
                <Media {...this.props} />
                <Links {...this.props} />
                <CollectionsEditor {...this.props} />
                <RecordTags {...this.props} />
                {
                  (this.props.recordFormStore.record.user.id === this.props.currentUser.id) &&
                <TeamPicker {...this.props} />                                             
                }
              </div>

              <div className="form-actions">
                <div className="secondary-actions">

                  {(this.props.recordFormStore.record.id && this.props.recordFormStore.record.state == "draft") && (
                    <button type="submit" className="delete" data-state="deleted" onClick={this.handleStateChange.bind(this)}>
                      Delete
                    </button>
                  )}

                  {(this.props.recordFormStore.record.id && this.props.recordFormStore.record.state === 'published') && (
                    <React.Fragment>
                      <button type="submit" className="delete" data-state="deleted" onClick={this.handleStateChange.bind(this)}>
                        Delete
                      </button>

                      <button type="submit" className="draft" data-state="draft" onClick={this.handleStateChange.bind(this)}>
                        Unpublish
                      </button>
                    </React.Fragment>
                  )}
                </div>

                <div className="primary-actions">
                  {/(draft|pending_review)/.test(this.props.recordFormStore.record.state) && (
                    <input type="submit" data-state="draft" onClick={this.handleClickedOnSave.bind(this)} value="Save as draft" />
                  )}

                  {
                    this.props.recordFormStore.record.valid_for_publishing && this.props.recordFormStore.record.user_can_publish &&
                    <input type="submit" data-state="published" onClick={this.handleClickedOnSave.bind(this)} value={this.props.recordFormStore.record.saveButtonLabel} />
                  }
                </div>

              </div>
              { !this.props.recordFormStore.record.valid_for_publishing &&
                <div className="form-validation-errors">
                  <p>Before you can publish this record, you need to add some information:</p>
                  <ul>
                    {publishingErrors}
                  </ul>
                </div>
              }

              { (!this.props.recordFormStore.record.user_can_publish && this.props.recordFormStore.record.state == "published" && this.props.currentUser.token) && (
                <div>
                  <div className="form-publishing-note">
                    <span>To make changes to this record you need to unpublish it first</span>
                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    );
  }
}
