import React,{Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';
import Img from 'react-image';
import VisibilitySensor from 'react-visibility-sensor';


@withRouter
@observer export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  highlightCard() {
    this.props.card.highlighted = true;

    // fixme - change this to indicate that the marker related to the hovered card is out of the viewport somehow?
    // // pan the map to this cards' position
    // if( !this.props.card.is_collection ) {
    //   this.props.mapViewStore.panTo(this.props.card.lat, this.props.card.lng);
    // }
  }

  render() {
    let container_classes = `m-record-card ${this.props.card.data.placeholder_class}`;

    if( !this.props.card.visible ) {
      container_classes += ' is-hidden';
    }

    if( this.props.card.is_collection ) container_classes += " m-record-card--collection";

    let resource = '/';
    if( this.props.card.is_collection ) {
      resource = 'collections';
    }else if(this.props.card.collection_id) {
      resource = `collections/${this.props.card.collection_id}`;
    }else {
      resource = 'records';
    }

    if( this.props.card.highlighted_by_marker) {
      container_classes += " highlighted";
    }

    const collection_path = location.pathname.match(/\/collections\/(\d+)/);
    let path = `/map/${resource}/${this.props.card.data.id}`;
    if( collection_path && collection_path.length > 1 ) {
      path = `/map/collections/${collection_path[1]}/records/${this.props.card.data.id}`;
    }

    let visibilityChanged = (visible) => {
      this.setState({visible: visible})
    };

    return (
      <VisibilitySensor onChange={visibilityChanged} partialVisibility={true}>
        <Link to={path} className={container_classes} onMouseEnter={this.highlightCard.bind(this)} onMouseLeave={()=>this.props.card.highlighted=false}>
          <div className="wrapper">
            {
              this.props.card.data.image &&
                <div className="image">
                  {
                    this.state.visible &&
                      <Fragment>
                        <Img src={this.props.card.data.image.card} loader={<span className="is-loading"></span>}/>
                      </Fragment>
                  }
                </div>
            }

            {this.props.card.is_collection && <span className="collection-indicator">Collection</span>}
            <div className="text-content">
              <h1>{this.props.card.data.title}</h1>
              <p dangerouslySetInnerHTML={{__html: this.props.card.data.excerpt}}>
              </p>
            </div>

            <div className="link-indicator">
            </div>
          </div>
        </Link>
      </VisibilitySensor>

    );
  }
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  // mapViewStore: PropTypes.object.isRequired
};
