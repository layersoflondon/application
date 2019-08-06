import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getSquare, updateSquare } from "../sources/map_tools_squares";

@inject('mapToolsStore')
@withRouter
@observer
export default class SquareEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true};
    }

    componentDidMount() {
        const squareId = parseFloat(this.props.match.params.id);
        // const features = this.props.mapToolsStore.cachedFeatureData.values().filter((feature) => parseInt(feature.properties.square.id, 10) === squareId);

        // this.props.mapToolsStore.setZoom(this.props.mapToolsStore.FULL_ZOOM);
        this.props.mapToolsStore.setSquare(squareId);

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
        const startEditing = () => {
            updateSquare(this.props.match.params.id, {state: "in_progress"}).then((response) => {
                console.log("OK", response.data);
                this.props.mapToolsStore.square = response.data;
            }).catch((error) => {
            });
        };

        return <div>
            <h3>This square needs tracing</h3>
            <p>
                Would you like to help us trace it?
            </p>

            <a className="button" href="#" onClick={startEditing}>Begin</a> or <a href="/maptools/squares">go back to the map</a>
        </div>
    }

    renderState_in_progress() {
        // this.props.mapToolsStore.addDrawingUIToMap();

        return <div>
            <p>
                Please trace all coloured areas which are touching the square.
            </p>

            <p>
                Click edit shape to change the existing ones, or go <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>back to the map</Link>
            </p>
        </div>
    }

    renderState_done() {
        return <span>done</span>
    }

    renderState_flagged() {
        return <span>flagged</span>
    }

    render() {

        if( this.state.loading || this.props.mapToolsStore.squareIsLoading ) {
            return <span>...</span>
        }else {
            const classNames = `square-editor ${this.props.mapToolsStore.square.state.label}`;

            return <div className={classNames}>
                {this[`renderState_${this.props.mapToolsStore.square.state.label}`]()}
            </div>;
        }
    }
}
