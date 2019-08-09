import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Route, withRouter } from 'react-router';
import SquareEditor from "./square_editor";
import SquareFilter from "./square_filter";

@inject('mapToolsStore')
@withRouter
@observer
export default class Squares extends React.Component {

    render() {
        return <div className="m-map-wrapper">
            <Route exact path={`${this.props.match.path}/:id`} component={SquareEditor} />
            <Route exact path={`${this.props.match.path}/:id`} component={SquareFilter} />

            <Route exact path={`${this.props.match.path}`} render={() => {
                return <div className="m-hint">Choose a square to begin</div>
            }} />
        </div>
    }
}
