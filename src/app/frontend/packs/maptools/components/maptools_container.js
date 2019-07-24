import React from 'react';
import { Route } from 'react-router';
import { NavLink} from 'react-router-dom';
import MapTools from "./maptools";

export default class MaptoolsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <React.Fragment>
            MaptoolsContainer: <NavLink to={'/maptools/squares'}>Squares</NavLink>
            <hr/>

            <Route path='/maptools/squares' component={MapTools} />
        </React.Fragment>
    }
}