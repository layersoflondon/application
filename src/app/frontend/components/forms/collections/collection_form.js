import React,{Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer} from "mobx-react";
import Collection from '../../../sources/collection';
import CollectionModel from '../../../models/collection';
import {inject} from "mobx-react/index";
import Record from "../../../sources/record";
import RecordModel from "../../../models/record";

@inject('router', 'mapViewStore', 'collectionStore', 'layersStore', 'trayViewStore')
@withRouter
@observer export default class CollectionForm extends Component {
  constructor(props) {
    super(props);

    // todo: set owner type either in the controller, or when the write state is changed
    this.state = {title: "", description: "", read_state: false, write_state: "creator", write_state_team_id: null, owner_type: "User"};
  }

  componentWillMount() {
    if( this.props.match.params.id ) {
      Collection.show(null, this.props.match.params.id).then((response) => {
        this.setState(response.data);
      }).catch((response) => {
        console.log("Error creating collection", response.data);
      });
    }

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

  render() {
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
                  <span>Keep this collection private <br /> Only you will see this collection (NB: the records within will still be visible)</span>
                </label>

              </div>

              <div className="form-group form-group--checkboxes-rows">
                <span className="label">Who can edit?</span>
                <label>
                  <input type="radio" name="write_state" checked={this.state.write_state=="creator"} value="creator" onChange={this.handleOnChange.bind(this)} /><span>Just you</span>
                </label>
                {/*<label>*/}
                  {/*<input type="radio" name="write_state" checked={this.state.write_state=="team"} value="team" onChange={this.handleOnChange.bind(this)} /><span>Members of</span>*/}
                    {/*<select className="in-context-input" placeholder="Team" name="team_id" onChange={this.handleOnChange.bind(this)} disabled={this.state.write_state!="team"}>*/}
                      {/*<option value="1" checked={this.state.team_id == "1"} onChange={this.handleOnChange.bind(this)}>Team One</option>*/}
                      {/*<option value="2" checked={this.state.team_id == "2"} onChange={this.handleOnChange.bind(this)}>Team Two</option>*/}
                      {/*<option value="3" checked={this.state.team_id == "3"} onChange={this.handleOnChange.bind(this)}>Team Three</option>*/}
                    {/*</select>*/}
                {/*</label>*/}
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
