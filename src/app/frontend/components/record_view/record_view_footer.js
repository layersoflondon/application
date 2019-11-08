import React,{Component, Fragment} from 'react';
import {observer} from "mobx-react";
import RecordViewComponentState from './record_view_component_state';
import {NavLink} from 'react-router-dom';
import {appendQueryString} from '../../helpers/modals';

@observer class RecordViewFooter extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * hide the currently visible record and pan to its position on the map
   */
  showOnMap() {
    // this.props.trayViewStore.trayLocked = true;

    this.props.mapViewStore.panTo(this.props.trayViewStore.record.lat, this.props.trayViewStore.record.lng, 18);
    const card = this.props.trayViewStore.cards.get(`record_${this.props.trayViewStore.record_id}`);
    if( card ) {
      card.highlighted = true;
    }

    this.props.trayViewStore.record = null;

    // const matches = this.props.router.location.pathname.match(/^(\/map\/collections\/\d+)\/records/);

    // if( matches && matches.length>1 ) {
    //   this.props.router.push(matches[1]);
    // }else {
    //   this.props.router.push('/map');
    // }
  }

  render() {
    const reportLinkPath = appendQueryString(this.props.location, [{key: 'reportRecord', value: true}]);
    
    return <Fragment>
      <div className="footer">
        <div className="attribution">
          <ul>
            <li><h4>Created:</h4> {this.props.trayViewStore.record.created_at}</li>
          </ul>
        </div>
        
        <div className="footer-actions">
          <button onClick={this.showOnMap.bind(this)}>See on map</button>
          <NavLink to={`${this.props.router.location.pathname}?${reportLinkPath}`}>Report this record</NavLink>
          {
            this.props.trayViewStore.record.user_can_edit_record &&
            <NavLink to={`/map?editRecord=${this.props.trayViewStore.record.id}`} className="edit">Edit</NavLink>
          }
        </div>
      </div>
    </Fragment>
  }
}

export default RecordViewComponentState.bindComponent(RecordViewFooter);
