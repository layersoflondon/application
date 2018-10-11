import React,{Component} from 'react';
import {inject, observer} from "mobx-react";
import {Redirect} from 'react-router';
import Details from './details';
import Credits from './credits'
import Location from './location'
import Dates from './dates';
import Media from './media';
import CollectionsEditor from './collections_editor';
import Record from './../../../sources/record';
import RecordModel from './../../../models/record';
import NotFound from "../../not_found";

@inject('router', 'mapViewStore', 'recordFormStore', 'trayViewStore', 'collectionStore', 'currentUser')
@observer export default class RecordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {errors: [], loadingError: false};
  }

  componentWillMount() {



    if( this.props.match.params.id && this.props.recordFormStore.record.id !== parseInt(this.props.match.params.id) ) {
      Record.show(null, this.props.match.params.id).then((response) => {
        this.props.recordFormStore.record = RecordModel.fromJS(response.data);
      }).catch((error) => {
        this.setState({loadingError: true});
        console.log(error);
      });
    } else if (this.props.location.pathname.match(/\/new/)) {
      if (!this.props.recordFormStore.record.lat || !this.props.recordFormStore.record.lng) {
        this.props.router.push('/map/choose-place');
      }
      this.createDraftRecord();
    }

  }


  componentWillUnmount() {
      // this.props.recordFormStore.record = new RecordModel()
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
    // rendering it. since the tray and map render their data from the trayViewStore.cards observable, we can just
    // overwrite the data there (see addOrUpdateRecord)
    const {state} = event.target.dataset;

    this.props.recordFormStore.record.state = state;

    this.props.recordFormStore.record.persist().then((response) => {
      let card = this.props.trayViewStore.addOrUpdateRecord(response.data);

      card = this.props.trayViewStore.cards.get(card.id);
      this.props.trayViewStore.record = card.data;
      this.props.trayViewStore.tray_is_visible = true;

      const {push} = {...this.props.router};
      push(`/map/records/${card.data.id}`);

      this.props.recordFormStore.record = new RecordModel();
    }).catch((error) => {
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
      Record.update(null, this.props.recordFormStore.record.id, {record: {state: state}}).then((response) => {
        if( state === 'deleted' ) {
          this.props.trayViewStore.cards.delete(`record_${this.props.recordFormStore.record.id}`);
          this.props.recordFormStore.record = new RecordModel();
          this.props.router.push('/map');
        }

        this.props.recordFormStore.record.state = state;
      });
    }
  }

  handleCloseOnClick(event) {
    event.preventDefault();
    this.props.recordFormStore.record = new RecordModel();

    if(this.props.match.params.collection_id) {
      this.props.router.push(`/map/collections/${this.props.match.params.collection_id}/records/${this.props.match.params.id}`);
    }else if(this.props.match.params.id) {
      this.props.trayViewStore.locked = false;
      this.props.router.push(`/map/records/${this.props.match.params.id}`);
    }else {
      this.props.trayViewStore.locked = false;
      this.props.router.push(`/map`);
    }


    this.props.mapViewStore.add_record_mode = false;
    this.props.trayViewStore.tray_is_visible = true;
  }

  render() {
    if (this.state.loadingError) {
      return <NotFound/>
    }

    if( this.props.recordFormStore.record.id && !this.props.recordFormStore.record.user_can_edit_record ) {
      return <div className='m-overlay'>
        <div className="close">
          <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
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
    // const publishingErrors = this.props.recordFormStore.record.errors_on_publishing.map((e) => {
    //   console.log(e);
    // });

    const publishingErrors = Object.entries(this.props.recordFormStore.record.errors_on_publishing).map((e) => {
      const fieldName = e[0];
      return e[1].map((message,i) => {
        const key = `${fieldName}-${i}`;
        return <li key={key}>{message}</li>;
      });
    });

    console.log(this.props.recordFormStore.record);

    return (
      <div className={className}>
        <div className="s-overlay--add-record is-showing">
          <div className="close">
            <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
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
                {/*<Links {...this.props} />*/}
                <CollectionsEditor {...this.props} />
                {/*<Team {...this.props} />*/}
              </div>

              <div className="form-actions">

                {/*

                If NEW:

                <div class="secondary-actions">
                  <button className="cancel">Cancel</button>
                </div>

                <div class="primary-actions">
                  <input type="submit" onClick={this.handleClickedOnSave.bind(this)} value="Save for later" />
                  <button className="publish">Publish</button>
                </div>

                If DRAFT:

                <div class="secondary-actions">
                  <button className="delete">Delete</button>
                </div>

                <div class="primary-actions">
                  <input type="submit" onClick={this.handleClickedOnSave.bind(this)} value="Save for later" />
                  <button className="publish">Publish</button>
                </div>

                If PUBLISHED:

                <div class="secondary-actions">
                  <button className="delete">Delete</button>
                  <button className="unpublish">Unpublish</button>
                </div>

                <div class="primary-actions">
                  <button className="publish">Publish</button>
                </div>

                */
                }

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
                  {this.props.recordFormStore.record.state === 'draft' && (
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

            </form>
          </div>
        </div>
      </div>
    );
  }
}
