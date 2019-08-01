import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('mapToolsStore')
@withRouter
@observer
export default class MapToolsOverview extends React.Component {
    render() {
        return <main className="maptools-intro">
            <section>
                <h1>How to use this site</h1>

                <div className="columns">
                    <div className="column">
                        <h3>Tracing</h3>
                        <img src="https://placehold.it/300x100" alt=""/>
                    </div>

                    <div className="column">
                        <h3>Checking</h3>
                        <img src="https://placehold.it/300x100" alt=""/>
                    </div>
                </div>

                <section className="sub-section">
                    <h1>About the project</h1>
                    <div className="details">
                        In 1899, Charles Booth and his team conducted a survey of the poverty levels across London.
                        As part of their results, they took a contemporary map, and highlighted area with coloured shapes to denote poverty level.
                        This site is an application to crowd-source the tracing of these areas into a vector format, which can be put to better use by historians.
                    </div>
                </section>

                <div className="actions">
                    <NavLink to='/maptools/squares' className="btn">Got it!</NavLink>
                </div>
            </section>
        </main>
    }
}