import React,{Component} from 'react';
import RecordFormComponentState from './record_form_component_state';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

@inject('mapboxStaticMapsKey')
@withRouter
@observer class Credits extends Component {
  constructor(props) {
    super(props);

  }

  changeLocation(event) {
    event.preventDefault();
    this.props.router.push('/map/choose-place');
  }

  render() {
    const creditsLabelClassName = !!this.props.recordFormStore.record.errors_on_publishing['credit'] ? "errors-on-publish" : "";
    let credit = this.props.recordFormStore.record.credit || "";
    // if(description.length) {
    //   description = description.map((el) => el.props.children).join("\n").replace(/^\n/,'');
    // }else {
    //   console.log(description);
    // }

    return (
      <div>
        <div className="form-group form-group--location">
          <label className={creditsLabelClassName}>Location</label>
          <div className="m-mini-map" style={{backgroundImage: `url(https://api.maptiler.com/maps/basic/static/${this.props.recordFormStore.record.lng},${this.props.recordFormStore.record.lat},16/280x150.png?key=${this.props.mapboxStaticMapsKey})`}} onClick={this.changeLocation.bind(this)}>
          </div>
        </div>
      </div>
    );
  }
}

export default RecordFormComponentState.bindComponent(Credits);
