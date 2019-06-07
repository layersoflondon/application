import React, {Component} from 'react';
import DivIcon from 'react-leaflet-div-icon';

export default class VectorGridFeature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latlng: this.props.latlng,
            properties: this.props.properties
        };
    }

    handleClick(event) {
        event.preventDefault();
        this.props.onClickHandler();
    }

    render() {
        const content = Object.keys(this.state.properties).map((key, index) => {
            return <li key={`feature-property-${key}-${index}-${this.props.featureId}`}>
                <span className="key">{key}</span> <span className="value">{this.state.properties[key]}</span>
            </li>
        });

        const marker = this.state.latlng ? (
            <DivIcon position={this.state.latlng} zIndexOffset={999999} onClick={this.props.onClickHandler()}>
                <div className="feature-icon">
                    <div className="feature-icon-content">
                        <ul>
                            {content}
                        </ul>
                    </div>
                </div>
            </DivIcon>
        ) : null;

        return marker;
    }
}
