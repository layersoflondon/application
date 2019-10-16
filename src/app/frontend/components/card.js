import React,{Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from "mobx-react";
import {Link, withRouter} from 'react-router-dom';
import Img from 'react-image';
import VisibilitySensor from 'react-visibility-sensor';


@inject('router', 'mapViewStore')
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

    let visibilityChanged = (visible) => {
      this.setState({visible: visible})
    };

    return (
      <VisibilitySensor onChange={visibilityChanged} partialVisibility={true}>
        <Link to={`?record=${this.props.card.data.id}`} className={container_classes} onMouseEnter={this.highlightCard.bind(this)} onMouseLeave={()=>this.props.card.highlighted=false}>
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
