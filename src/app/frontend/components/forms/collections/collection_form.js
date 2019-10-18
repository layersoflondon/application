import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer} from "mobx-react";
import Collection from '../../../sources/collection';
import CollectionModel from '../../../models/collection';
import {inject} from "mobx-react/index";
import Team from "../../../sources/team";
import Select from 'react-select'
import Record from "../../../sources/record";
import RecordModel from "../../../models/record";
import {recordEvent} from "../../../config/data_layer";
import {closeModalLink, getQueryStringParam, removeModal} from '../../../helpers/modals';

@inject('router', 'mapViewStore', 'collectionStore', 'layersStore', 'trayViewStore', 'collectionFormStore')
@withRouter
@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    // todo: set owner type either in the controller, or when the write state is changed
    this.state = {id: null, title: "", description: "", read_state: 'public_read', write_state: "creator", write_state_team_id: null, owner_type: "User", teams: null, errors: []};
  }

  componentWillMount() {
    const newCollection = getQueryStringParam(this.props.router.location, 'newCollection') === "true";
    const editCollection = getQueryStringParam(this.props.router.location, 'editCollection');

    if(newCollection) {
      this.props.collectionFormStore.collection = CollectionModel.fromJS({}, this.props.trayViewStore);
    }else if(editCollection) {
      Collection.show(null, editCollection).then((response) => {
        this.setState(response.data);
        this.props.collectionFormStore.collection = CollectionModel.fromJS(response.data, this.props.trayViewStore);
      });
    }

    let teams = [];
    Team.index().then((response) => {
      teams = response.data.map((team) => ({value: team.id, label: team.name}));
      this.setState({teams: teams});
    });

    //TODO why do we do this?
    if( this.props.trayViewStore.cards.size === 0 && !this.props.trayViewStore.locked ) {
      setTimeout(() => {
        this.props.trayViewStore.restoreRootState();
      }, 10);
    }
  }

  handleOnChange(event) {
    let { name, value } = event.target;

    if( event.target.type === "checkbox" ) {
      value = event.target.checked;
    }
    this.setState({
      [name]: value
    });
    this.props.collectionFormStore.collection[name] = value;
  }

  handleOnSubmit(event) {
    event.preventDefault();

    this.props.collectionFormStore.collection.persist(this.state).then((response) => {
      const collection = CollectionModel.fromJS(response.data, this.props.trayViewStore);
      this.props.collectionStore.addCollection(collection);
      this.props.trayViewStore.collection_id = collection.id;
      recordEvent('createCollection', {
        'collection': collection.title
      });
      
      this.props.mapViewStore.inAddCollectionMode  = false;
      this.props.mapViewStore.inEditCollectionMode = false;
      this.props.mapViewStore.newCollectionModal   = false;
      this.props.mapViewStore.editCollectionModal  = false;
      this.props.router.push(`/map/collections/${collection.id}`);
    }).catch((response) => {
      console.log(response, response.data);
      this.props.router.push(`/map`);
    });
  }

  handleOnReadStateChange(event) {
    const read_state = event.target.checked ? "private_read" : "public_read";
    this.setState({read_state: read_state});
    this.props.collectionFormStore.collection.read_state = read_state;
  }

  handleSelectOnChange(option, event) {
    this.setState({write_state_team_id: option.value});
    this.props.collectionFormStore.collection.write_state_team_id = option.value;
  }

  render() {
    if( this.state.teams === null) {
      return <div/> // wait for the teams to be loaded
    }
    
    if(!(this.props.mapViewStore.inEditCollectionMode || this.props.mapViewStore.inAddCollectionMode)) {
      return <React.Fragment />;
    }

    let className = "m-overlay is-showing";
    const formTitle = this.props.collectionFormStore.collection.is_persisted ? "Edit collection" : "Create collection";

    const closePath = removeModal(this.props.router.location, 'newCollection');
    const handleOnClick = () => {
      removeModal(this.props.router.location, 'newCollection', this.props.mapViewStore);
    }

    if (!this.props.collectionFormStore.collection.is_editable) {
      return (
        <div className={className}>
          <div className="s-overlay--add-collection is-showing">

            <div className="close">
              <Link to={closeModalLink(this.props.router.location, 'newCollection')} className="close" onClick={handleOnClick}>Close</Link>
            </div>

            <div className="m-add-collection">

              <h1>{formTitle}</h1>
              <p>You don't have permission to edit this collection.</p>
            </div>
        </div>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <div className="s-overlay--add-collection is-showing">

            <div className="close">
              <Link to={closeModalLink(this.props.router.location, 'newCollection')} className="close" onClick={handleOnClick}>Close</Link>
            </div>

            <div className="m-add-collection">

              <h1>{formTitle}</h1>

              <form className="form--chunky form--over-white" onSubmit={this.handleOnSubmit.bind(this)}>
                <div className="form-group">
                  <label>Name</label>
                  <input placeholder="" type="text" name="title" value={this.state.title} onChange={this.handleOnChange.bind(this)} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="10" placeholder="" name="description" value={this.state.description} onChange={this.handleOnChange.bind(this)}>
                </textarea>
                </div>

                <div className="form-group form-group--checkboxes-rows">
                  <span className="label">Who can see?</span>
                  <label>
                    <input type="checkbox" name="read_state" checked={this.state.read_state === "private_read"} onChange={this.handleOnReadStateChange.bind(this)} />
                    <span>Keep this collection private <br /> <span className="nb">This will create a <strong>collection</strong> that only you can see.<br /> The records within will still be publicly viewable.</span></span>
                  </label>

                </div>

                <div className="form-group form-group--checkboxes-rows">
                  <span className="label">Who can edit?</span>
                  <label>
                    <input type="radio" name="write_state" checked={this.state.write_state ==="creator"} value="creator" onChange={this.handleOnChange.bind(this)} /><span>Just you</span>
                  </label>

                  {this.state.teams.length>0 && this.state.read_state === "public_read" && (
                    <label>
                      <input type="radio" name="write_state" checked={this.state.write_state ==="team"} value="team" onChange={this.handleOnChange.bind(this)} /><span>Members of</span>
                      <Select placeholder='' options={this.state.teams} hideSelectedOptions={true} isMulti={false} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef} value={this.state.teams.find((t) => t.value === this.props.collectionFormStore.collection.write_state_team_id)} />
                    </label>
                  )}

                  { this.state.read_state === "public_read" && (
                  <label>
                    <input type="radio" name="write_state" checked={this.state.write_state ==="everyone"} value="everyone" onChange={this.handleOnChange.bind(this)} disabled={this.state.read_state === "private_read"} /><span>Anyone</span>
                  </label>
                    
                  )}
                </div>

                <input value="Save" type="submit" />
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
