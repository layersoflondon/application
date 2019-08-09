import React from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import Img from 'react-image';

@inject('mapToolsStore')
@withRouter
@observer
export default class MapToolsOverview extends React.Component {
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
              <p>Vestibulum blandit varius odio, nec tristique diam tincidunt a. Sed suscipit eget lacus eget egestas.
                Aenean fermentum ligula.</p>
            </div>

            <div className="column">
              <h3>Checking</h3>
              <Img src={checkingUrl} />
              <p>Duis eget neque in ligula dignissim faucibus. Sed suscipit eget lacus eget egestas. Aenean fermentum
                ligula.</p>
            </div>

          </div>

          <NavLink to='/maptools/squares' className="button">Got it!</NavLink>

        </section>

        <section>

          <h1>About the project</h1>

          <div className="details">
            In 1899, Charles Booth and his team conducted a survey of the poverty levels across London.
            As part of their results, they took a contemporary map, and highlighted area with coloured shapes to denote
            poverty level.
            This site is an application to crowd-source the tracing of these areas into a vector format, which can be
            put to better use by historians.
          </div>

        </section>

      </div>

    </main>
  }
}