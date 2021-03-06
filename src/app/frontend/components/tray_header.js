import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {Link} from 'react-router-dom';

export default class TrayHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      introShowing: false
    }
  }

  toggleIntro() {
    this.setState({introShowing: !this.state.introShowing});
  }

  render() {
    const introClassName = (this.state.introShowing) ? "is-expanded" : "";

    return <React.Fragment>
      <Helmet>
        <title>{this.props.title} | Layers of London | Recording the Layers of London's Rich Heritage</title>
        <meta name='description' content={`${this.props.metaDescription} and thousands of other fascinating records and collections on Layers of London. Add your own records, and help us build more layers.`} />
        <meta name='keywords' content={`${this.props.title}, layers of london, london, history, maps, records, collections, history, historical accounts, university of london, school of advanced study`} />
      </Helmet>

      <div className={`m-tray-title-area ${this.props.headerClass}`}>
        <div className="close">
          <Link to={this.props.closePath} className="close" onClick={this.props.closeOnClick}>Close</Link>
        </div>
        
        {
          this.props.title &&
          <h1 dangerouslySetInnerHTML={{__html: this.props.title}}></h1>
        }

        {
          this.props.subtitle &&
          <h2>{this.props.subtitle}</h2>
        }

        <div className="meta">
          {this.props.metaData}
        </div>
      </div>
      {
        this.props.introduction &&
        <div className={`m-tray-introduction ${introClassName}`}>
          <div className="wrap">
            <p dangerouslySetInnerHTML={{__html: this.props.introduction}}></p>
          </div>

          <a className="read-more" onClick={this.toggleIntro.bind(this)}>{this.state.introShowing ? "Hide" : "Read more"}</a>
        </div>
      }
    </React.Fragment>;
  }
}

TrayHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  metaDescription: PropTypes.string.isRequired,
  closePath: PropTypes.string
};

TrayHeader.defaultProps = {
  closeOnClick: () => {},
  headerClass: ''
}
