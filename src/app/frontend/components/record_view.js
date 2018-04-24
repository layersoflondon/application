import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import Parser from 'html-react-parser';

import Record from '../sources/record';

@observer export default class RecordView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({loading: true});

    // Record.show(null, this.props.record_id).then((response) => {
    //   let state = response.data;
    // });
    // state.loading = false;
    this.setState({loading: false});
  }

  componentWillUnmount() {
  }

  render_state_loading_true() {
    return <div className="m-overlay is-showing">
      loading
    </div>
  }

  render_state_loading_false() {
    return <div className="m-overlay is-showing">
      <div className="s-overlay--record is-showing">
        <div className="m-record">
          <div className="next">
            <button className="next" onClick={() => this.props.trayViewStore.moveToNextCard()}>Next</button>
          </div>
          <div className="previous">
            <button className="previous" onClick={() => this.props.trayViewStore.moveToPreviousCard()}>Previous</button>
          </div>
          <div className="close">
            <button className="close" onClick={()=>this.props.trayViewStore.visible_record_id=null}>Close</button>
          </div>

          <div className="wrap">
            <div className="m-record-hero">
              <div className="image random-image" style={{'backgroundImage': 'url(http://placehold.it/900x400)'}}>
              </div>
            </div>

            <div className="title">
              <h1>{this.props.trayViewStore.visible_record.title}</h1>
            </div>

            <div className="meta">
              <div className="dates">
                <span className="date start-date"> ${this.props.trayViewStore.visible_record.date_from}</span>
              </div>

              <div className="creator">Created by <a href={`/users/${this.props.trayViewStore.visible_record.user.id}`}>{this.props.trayViewStore.visible_record.user.name}</a></div>

              <div className="social-status">
                <button className="like">
                  <span>Like</span>
                </button>
                {this.props.trayViewStore.visible_record.view_count} views <br/>
                {this.props.trayViewStore.visible_record.like_count} likes
              </div>

              <div className="share-record">
                <button className="share"><span>Share</span></button>
                Share this record
              </div>

            </div>

            <div className="place">
              <div className="map">
              </div>
              <div className="text">Palace St, Westminster, London SW1E | {this.props.trayViewStore.visible_record.lat}, {this.props.trayViewStore.visible_record.lng}</div>
            </div>


            <div className="m-article">
              {Parser(this.props.trayViewStore.visible_record.description)}
            </div>

            <div className="attribution">
              <ul>
                <li><h4>Created:</h4> 22nd June 2017</li>
                <li><h4>Credits:</h4> Curabitur eu euismod risus</li>
              </ul>
            </div>

            <div className="actions">
              <button className="add-to-collection">Add to collection</button>
              <button className="contact-owner">Contact owner</button>
              <button className="flag">Flag</button>
              <button className="edit">Edit</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  }

  render() {
    return this[`render_state_loading_${this.state.loading}`]();
  }
}
