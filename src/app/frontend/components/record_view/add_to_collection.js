import React,{Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import CollectionPicker from "../collection_picker";
import {inject, observer} from 'mobx-react';
import RecordModel from '../../models/record';
import Record from './../../sources/record';

@inject('trayViewStore', 'router')
@observer export default class AddToCollection extends Component {

  constructor(props) {
    super(props);


  }

  componentWillMount() {
    if (this.props.match.params.id && (this.props.trayViewStore.record === null || this.props.trayViewStore.record.id !== parseInt(this.props.match.params.id))) {
      Record.show(null, this.props.match.params.id).then((response) => {
        this.props.trayViewStore.record = RecordModel.fromJS(response.data)
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  handleCloseOnClick(e) {
    e.preventDefault();
    this.props.router.push(`/map/records/${this.trayViewStore.record.id}`);
  }

  render() {
    return <Fragment>
      <div className="m-overlay is-showing" style={{zIndex: 12341234, top: 0, left: 0}}>
        <div className="close">
          {this.props.trayViewStore.record &&
          <Link to={`/map/records/${this.props.trayViewStore.record.id}`}>Close</Link>}
        </div>

        <div className="m-add-other-record-to-collection">
          <h1>Add to a collection</h1>

          <div className="form form--chunky">
                {this.props.trayViewStore.record &&
              <CollectionPicker record={this.props.trayViewStore.record}/>}



            <div className="form-actions">
              <div className="primary-actions">
                {this.props.trayViewStore.record &&
                <Link to={`/map/records/${this.props.trayViewStore.record.id}`}>Done</Link>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  }


}
