import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Route, withRouter } from 'react-router';
import SquareEditor from "./square_editor";
import SquareFilter from "./square_filter";
import KeyImageBlank from '../../../assets/images/key-blank.jpg'
import KeyImageYellow from '../../../assets/images/key-yellow.jpg'
import KeyImageGreen from '../../../assets/images/key-green.jpg'

@inject('mapToolsStore')
@withRouter
@observer
export default class Squares extends React.Component {

    componentDidMount() {
        this.props.mapToolsStore.setZoom(this.props.mapToolsStore.DEFAULT_ZOOM);
    }

    render() {
        return <div className="m-map-wrapper">
            <Route exact path={`${this.props.match.path}/:id`} component={SquareEditor} />
            <Route exact path={`${this.props.match.path}/:id`} component={SquareFilter} />

            <Route exact path={`${this.props.match.path}`} render={() => {
                return <React.Fragment>
                    <div className="m-hint">Choose a square to begin</div>
                    <div className="m-key">
                        <img src={KeyImageBlank} alt="Key image blank square" />Blank squares need tracing<br />
                        <img src={KeyImageYellow} alt="Key image yellow square" />Yellow squares need checking<br />
                        <img src={KeyImageGreen} alt="Key image green square" />Green squares are done!
                    </div>
                </React.Fragment>
            }} />
        </div>
    }
}
