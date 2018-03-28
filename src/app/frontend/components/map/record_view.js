import React,{Component} from 'react';
import PropTypes from 'prop-types';

export default class RecordView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let classes = "s-overlay--record";


    return <div className={classes}>
      <div className="m-record">
        <div className="next">
          <button className="next">Next</button>
        </div>
        <div className="previous">
          <button className="previous">Previous</button>
        </div>
        <div className="close">
          <button className="close">Close</button>
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

          <h1>Images of Marsmarsh</h1>

          <div className="dates">
            <span className="date start-date"> 1st Jan 1857</span>
          </div>

          <div className="creator">Created by <a href="#">Abigail Winters</a></div>
          <div className="m-record-hero">
            <div className="image random-image" style="background-image: url(http://placehold.it/900x400);">
            </div>
          </div>

          <div className="place">
            <div className="map">
            </div>
            <div className="text">
              Palace St, Westminster, London SW1E | 51.497275, -0.139333
            </div>
          </div>


          <div className="m-article">

            <p>Sydney’s case is rather different. He enlisted into the Royal Army Medical Corps on 15 June 1916. As
              a Christian he knew he would not be able to take part in combat but felt it his duty to help by
              tending to the sick and wounded. At the end of 1915, still well before conscription came in, he was
              posted to Egypt.</p>
            <p>Sydney died in Lewes, Sussex in 1976 aged about 84.</p>
            <p>PR/IWM</p>
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
  }
}

RecordView.propTypes = {
  card: PropTypes.object.isRequired
};