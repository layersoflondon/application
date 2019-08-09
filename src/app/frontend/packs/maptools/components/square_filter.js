import React from 'react';
import Switch from 'react-switch';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

@inject('mapToolsStore', 'userSession')
@withRouter
@observer
export default class SquareFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        this.props.mapToolsStore.toggleShowShapes();
    }

    render() {
        const label = this.props.mapToolsStore.showShapes ? 'Hide shapes' : 'Show shapes';
        return <div className="m-squares-filter">
            <label>
                <span>{label}</span>
                <Switch onChange={this.handleChange.bind(this)} checked={this.props.mapToolsStore.showShapes} disabled={this.props.mapToolsStore.inEditOrDrawingMode} />
            </label>
        </div>;
    }
}
