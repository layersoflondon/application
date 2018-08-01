import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {NavLink} from 'react-router-dom';

@observer class RecordViewFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const link_path = this.props.match.params.collection_id ? `/map/collections/${this.props.match.params.collection_id}` : '/map';

    const subject = `Flagged record&body=Hi - The record '${this.props.trayViewStore.record.title}' (https://beta.layersoflondon.org/map/records/${this.props.trayViewStore.record.id}) is incorrect, inaccurate or inappropriate.`;

    return <Fragment>
      <div className="footer">
        <div className="attribution">
          <ul>
            <li><h4>Created:</h4> {this.props.trayViewStore.record.created_at}</li>
            {
              this.props.trayViewStore.record.credit &&
              <li><h4>Credit:</h4> {this.props.trayViewStore.record.credit}</li>
            }
          </ul>
        </div>
        <div className="footer-actions">
          {/*<button className="contact-owner">Contact owner</button>*/}
          {/*<button className="flag">Report this record</button>*/}
          <a href={`mailto:layersoflondon@lon.ac.uk?subject=${subject}`}>Report this record</a>

          {
            this.props.trayViewStore.record.user_can_edit_record &&
            <NavLink to={`${link_path}/records/${this.props.match.params.id}/edit`} className="edit">Edit</NavLink>
          }
        </div>
      </div>

    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewFooter);
