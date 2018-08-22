import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer} from "mobx-react";
import Collection from '../../../sources/collection';
import CollectionModel from '../../../models/collection';
import {inject} from "mobx-react/index";
import Team from "../../../sources/team";
import Select from 'react-select'

@inject('router', 'mapViewStore', 'collectionStore', 'layersStore', 'trayViewStore')
@withRouter
@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    // todo: set owner type either in the controller, or when the write state is changed
    this.state = {title: "", description: "", read_state: false, write_state: "creator", write_state_team_id: null, owner_type: "User", teams: null};
  }

  componentWillMount() {
    if( this.props.match.params.id ) {
      Collection.show(null, this.props.match.params.id).then((response) => {
        this.setState(response.data);
      }).catch((response) => {
        console.log("Error creating collection", response.data);
      });
    }

    let teams = [];
    Team.index().then((response) => {
      teams = response.data.map((team) => ({value: team.id, label: team.name}));
      this.setState({teams: teams});
    });

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
  }

  handleOnSubmit(event) {
    event.preventDefault();

    Collection.create(null, {collection: this.state}).then((response) => {
      const collection = CollectionModel.fromJS(response.data);
      this.props.collectionStore.addCollection(collection);
      this.props.router.goBack();

    }).catch((response) => {
      this.props.router.goBack();
    });
  }

  handleOnReadStateChange(event) {
    this.setState({read_state: event.target.checked ? "private_read" : "public_read"});
  }

  handleSelectOnChange(option, event) {
    this.setState({write_state_team_id: option.value});
  }

  render() {
    if( this.state.teams === null) {
      return <div/> // wait for the teams to be loaded
    }

    let className = "m-overlay";
    if( this.props.mapViewStore.overlay === 'collection_form' ) className+=" is-showing";

    return (
      <div className={className}>
        <div className="s-overlay--add-collection is-showing">

          <div className="close">
            <Link to="/map" className="close">Close</Link>
          </div>

          <div className="m-add-collection">

            <h1>Create collection</h1>

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
                  <input type="checkbox" name="read_state" value={this.state.read_state} onChange={this.handleOnReadStateChange.bind(this)} />
                  <span>Keep this collection private <br /> <span className="nb">This will create a <strong>collection</strong> that only you can see.<br /> The records within will still be publicly viewable.</span></span>
                </label>

              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can edit?</span>
                <label>
                  <input type="radio" name="write_state" checked={this.state.write_state=="creator"} value="creator" onChange={this.handleOnChange.bind(this)} /><span>Just you</span>
                </label>

                {this.state.teams.length>0 && (
                  <label>
                    <input type="radio" name="write_state" checked={this.state.write_state=="team"} value="team" onChange={this.handleOnChange.bind(this)} /><span>Members of</span>
                    <Select placeholder='' options={this.state.teams} hideSelectedOptions={true} isMulti={false} searchable={true} onChange={this.handleSelectOnChange.bind(this)} closeMenuOnSelect={true} ref={this.selectRef}/>
                  </label>
                )}

                <label>
                  <input type="radio" name="write_state" checked={this.state.write_state=="everyone"} value="everyone" onChange={this.handleOnChange.bind(this)} /><span>Anyone</span>
                </label>
              </div>

              <input value="Save" type="submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
