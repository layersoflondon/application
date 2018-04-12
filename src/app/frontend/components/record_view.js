import React,{Component} from 'react';
import PropTypes from 'prop-types';

import Record from '../sources/record';

export default class RecordView extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({loading: true});

    Record.show(null, this.props.record_id).then((response) => {
      let state = response.data;
      state.loading = false;
      this.setState(state)
    });
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
            <button className="next">Next</button>
          </div>
          <div className="previous">
            <button className="previous">Previous</button>
          </div>
          <div className="close">
            <button className="close" onClick={()=>this.props.mapViewStore.visible_record_id=null}>Close</button>
          </div>

          <div className="wrap">

            <div className="m-social-status">
              <button className="like">Like</button>
              173 views, 54 likes
            </div>

            <div className="m-share-record">
              <button className="share">Share</button>
              Share this record
            </div>

            <h1>{this.state.title}</h1>

            <div className="dates">
              <span className="date start-date"> {this.state.date}</span>
            </div>

            <div className="creator">Created by <a href="#">Abigail Winters</a></div>
            <div className="m-record-hero">
              <div className="image random-image" style={{'backgroundImage': 'url(http://placehold.it/900x400)'}}>
              </div>
            </div>

            <div className="place">
              <div className="map">
              </div>
              <div className="text">
                Palace St, Westminster, London SW1E | {this.state.lat}, {this.state.lng}
              </div>
            </div>


            <div className="m-article">
              {this.state.description}
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

RecordView.propTypes = {
  card: PropTypes.object.isRequired
};