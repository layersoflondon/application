import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getSquare, updateSquare } from "../sources/map_tools_squares";

@inject('mapToolsStore', 'userSession')
@withRouter
@observer
export default class SquareEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    updateSquareState(state) {
        updateSquare(this.props.match.params.id, {state: state}).then((response) => {
            this.props.mapToolsStore.square = response.data;
        });
    }

    componentDidMount() {
        const squareId = parseFloat(this.props.match.params.id);
        // const features = this.props.mapToolsStore.cachedFeatureData.values().filter((feature) => parseInt(feature.properties.square.id, 10) === squareId);

        // this.props.mapToolsStore.setZoom(this.props.mapToolsStore.FULL_ZOOM);
        this.props.mapToolsStore.squareId = squareId;
        this.props.mapToolsStore.squareIsLoading = true;
        getSquare(squareId).then((response) => {
            this.props.mapToolsStore.square = response.data;
            this.props.mapToolsStore.squareIsLoading = false;
        });

        this.reloadSquare();
    }

    reloadSquare() {
        (async () => {
            // const square = await getSquare(this.props.match.params.id);
            // this.props.mapToolsStore.square = square.data;
            // console.log(this.props.mapToolsStore.square);
            this.setState({loading: false});
        })();
    }

    handleGoBackClick(event) {
        this.props.mapToolsStore.zoomOut();
    }

    renderState_not_started() {
        return <div>
            <h3>This square needs <strong>tracing</strong>.</h3>
            <p>Would you like to help us trace it?</p>

            <a className="button" href="#" onClick={() => this.updateSquareState('in_progress')}>Begin</a>
            or <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>choose another square</Link>.
        </div>
    }

    renderState_in_progress() {
        return <div>
            <p>Please trace all coloured areas which are within, or touching, the square using the tools below.</p>
            <p>Click 'Edit layers' to change the existing ones.</p>
            <button onClick={() => this.updateSquareState('done')}>I'm done!</button>
            or go <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>back to the map</Link>.
        </div>
    }

    renderState_done() {
        return <div>
            <h1>
                Please check that:
            </h1>
            <p>All polygons touching the square are drawn.</p>
            <p>All polygons are the right shape.</p>
            <p>All polygons are the right color.</p>
            <p>Hit Edit mode to correct any issues.</p>

            <hr/>
            <button onClick={() => this.updateSquareState('back_in_progress')}>Edit mode</button>
            <br/>
            <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>Back to the map</Link>
        </div>
    }

    renderState_flagged() {
        return <span>flagged</span>
    }

    render() {
        if( !this.props.userSession.id ) {
            return <div className={`m-edit-hint not-logged-in`}>
                <h3>You need to be signed in in order to start tracing. </h3>
                <a href="/users/sign_up">Sign up</a> or sign in <a href="/users/sign_in">here</a> to get started!
            </div>;
        }

        if( this.state.loading || this.props.mapToolsStore.squareIsLoading ) {
            return <span>...</span>
        }else {

            const editMode = this.props.mapToolsStore.inEditOrDrawingMode;
            const classNames = `m-edit-hint ${this.props.mapToolsStore.square.state.label} ${editMode ? 'edit-mode' : ''}`;

            return <div className={classNames}>
                {this[`renderState_${this.props.mapToolsStore.square.state.label}`]()}
            </div>;
        }
    }
}
