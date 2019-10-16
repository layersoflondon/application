import React,{Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import VisibilitySensor from 'react-visibility-sensor';
import {Link, withRouter} from 'react-router-dom';
import Img from 'react-image';

@withRouter
export default class CollectionCard extends Component {
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
    return <VisibilitySensor onChange={(visible) => this.setState({visible})} partialVisibility={true}>
      <Link to={`/map/collections/${this.props.card.data.id}`} className='m-record-card m-record-card--collection' onMouseEnter={this.highlightCard.bind(this)} onMouseLeave={()=>this.props.card.highlighted=false}>
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
            <h1>{this.props.card.data.title}(collection)</h1>
            <p dangerouslySetInnerHTML={{__html: this.props.card.data.excerpt}}>
            </p>
          </div>

          <div className="link-indicator">
          </div>
        </div>
      </Link>
    </VisibilitySensor>
  }
}
    

CollectionCard.propTypes = {
  card: PropTypes.object.isRequired
};
