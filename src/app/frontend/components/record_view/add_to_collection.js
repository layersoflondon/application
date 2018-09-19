import React,{Component, Fragment} from 'react';
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
    this.props.router.history.push(`/map/records/${this.trayViewStore.record.id}`);
  }

  render() {
    return <Fragment>
      <div className="m-overlay is-showing">
        <div className="close">
          <a href="#" className="close" onClick={this.handleCloseOnClick.bind(this)}>Close</a>
        </div>

        <div className="m-record-collections">
          <h1>Add to a collection</h1>

          <div>
            <div className={`section section--add-to-collection`}>

              <div className="pane" >
                {this.props.trayViewStore.record &&
              <CollectionPicker record={this.props.trayViewStore.record}/>}


              </div>

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  }


}
