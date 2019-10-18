import React,{Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {observer} from "mobx-react";
import {Helmet} from 'react-helmet';

import RecordViewMediaList from './record_view_media_list';
import RecordViewComponentState from "./record_view_component_state";

import RecordViewHeader from './record_view_header';
import RecordViewContent from './record_view_content';
import RecordViewFooter from './record_view_footer';
import NotFound from '../not_found'

import {recordPageView} from "../../config/data_layer";
import {removeModal, getValueForModal, closeModalLink} from '../../helpers/modals';

@observer class RecordView extends Component {
  constructor(props) {
    super(props);

    this.state = {loading: true};

    this.fetchRecord = () => {
      const id = getValueForModal(this.props.location, 'record');
      return this.props.trayViewStore.fetchRecord(id)
    }
  }

  componentDidMount() {
    this.fetchRecord();
  }

  componentDidUpdate(oldProps) {
    const previousId = getValueForModal(oldProps.router.location, 'record');
    const id = getValueForModal(this.props.router.location, 'record');
    
    if(id && previousId !== id) {
      this.fetchRecord();
    }
  }

  handleOnClick(event) {
    this.props.mapViewStore.toggleModal('record', false);
    this.props.trayViewStore.record = null;
  }
  
  render() {
    if (this.props.trayViewStore.loading_error) {
      return <NotFound {...this.props} />
    }

    if( this.props.trayViewStore.record && this.props.mapViewStore.recordModal ) {
      if (this.props.router.location.pathname.search(/\/media/) === -1) {
        recordPageView(this.props.trayViewStore.record.title);
      }
      let header_classes = "m-record";
      let header_gallery_component = null;
      let content_gallery_component = null;

      if( this.props.trayViewStore.record.view_type === 'gallery' ) {
        header_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} numberOfItems={4} router={this.props.router} />;
      }else {
        content_gallery_component = <RecordViewMediaList record={this.props.trayViewStore.record} router={this.props.router} />;
      }

      return(
        <Fragment>
          <Helmet>
            <title>{this.props.trayViewStore.record.title} | Layers of London | Recording the Layers of London's Rich Heritage</title>
            <meta name='og:title' content={`${this.props.trayViewStore.record.title} | Layers of London | Recording the Layers of London's Rich Heritage`} />
            <meta name='description' content={`Read about ${this.props.trayViewStore.record.title} and thousands of other fascinating records on Layers of London. Add your own records, and help us build more layers.`}/>
            <meta name='og:description' content={`Read about ${this.props.trayViewStore.record.title} and thousands of other fascinating records on Layers of London. Add your own records, and help us build more layers.`}/>
            <meta name='keywords' content={`${this.props.trayViewStore.record.title}, layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`} />
            <link rel='canonical' href={`${window.location.protocol}//${window.location.host}/map/records/${this.props.trayViewStore.record.id}`} />
            <meta name='og:url' content={`${window.location.protocol}//${window.location.host}/map/records/${this.props.trayViewStore.record.id}`} />
            {this.props.trayViewStore.record.has_hero_image &&
            <meta name='og:image' content={this.props.trayViewStore.record.hero_image.primary}/>
            }
            <meta name='twitter:card' content='summary' />

          </Helmet>

          <div className="m-overlay is-showing">
            <div className="s-overlay--record is-showing">
              <div className={header_classes}>
                <div className="close">
                  <Link onClick={this.handleOnClick.bind(this)} to={closeModalLink(this.props.router.location, 'record')} className="close">Close</Link>
                </div>
                
                <div className="wrap">
                  <RecordViewHeader  {...this.props} gallery={header_gallery_component} />
                  <RecordViewContent {...this.props} gallery={content_gallery_component} />
                  <RecordViewFooter  {...this.props} />

                  {this.props.children}
                </div>

              </div>
            </div>
          </div>
        </Fragment>

        );
    }else {
      return <span></span>
    }
  }
}

export default RecordViewComponentState.bindComponent(RecordView);
