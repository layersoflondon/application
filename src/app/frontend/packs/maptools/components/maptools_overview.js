import React from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import Img from 'react-image';

@inject('mapToolsStore')
@withRouter
@observer
export default class MapToolsOverview extends React.Component {
  componentDidMount() {
    this.props.mapToolsStore.setZoom(this.props.mapToolsStore.WELCOME_ZOOM);
  }

  render() {
    const tracingUrl = require('../../../assets/images/booth/intro-tracing.jpg');
    const checkingUrl = require('../../../assets/images/booth/intro-checking.jpg');
    console.log(tracingUrl);

    return <main className="maptools-intro">

      <div className="m-intro">

        <section>

          <h1>How to use this site</h1>

          <div className="columns">
            <div className="column">
              <h3>Tracing</h3>
              <Img src={tracingUrl} />
              <p>
                Draw shapes to trace around colour coded areas of the map.
              </p>
            </div>

            <div className="column">
              <h3>Checking</h3>
              <Img src={checkingUrl} />
              <p>
                Check the work of others to verify that areas of the map have been traced and colour coded correctly.
              </p>
            </div>

          </div>

          <NavLink to='/maptools/squares' className="button">Got it!</NavLink>

        </section>

        <section>

          <h1>About the project</h1>

          <div className="details">
            <p>
              In 1889 the first volume of Charles Booth's monumental London enquiry was published.  Included within it was a map which used different colours to codify the levels of wealth and poverty on London's streets.
            </p>

            <p>
              We want to accurately capture those classifications and colours to better understand London at the time. You can help us to do that by tracing the different colours on the map and checking the accuracy of tracing that has already been done.
            </p>

            <p>
              To learn more about Charles Booth’s life and work, visit <a href="https://booth.lse.ac.uk/">Charles Booth’s London</a>.
            </p>
          </div>

        </section>

      </div>

    </main>
  }
}