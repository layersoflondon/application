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

    contentFor(key) {
        let content = this.state.properties[key];

        if(/^(href|hyperlink)$/i.test(key) && /^https?:\/\//i.test(content)) {
            const link = dcocument.createElement('a');
            link.href = content;
            content = link.toString();
        }

        return content;
    }

    render() {
        const content = Object.keys(this.state.properties).map((key, index) => {
            return <tr key={`feature-property-${key}-${index}-${this.props.featureId}`}>
                <th className="key">{key}</th>
                <td className="value" dangerouslySetInnerHTML={{__html: this.contentFor(key)}} />
            </tr>
        });

        const marker = this.state.latlng ? (
            <DivIcon position={this.state.latlng} zIndexOffset={999999} onClick={this.props.onClickHandler()}>
                <div className="feature-icon">
                    <div className="feature-icon-content">
                        <table>
                            <tbody>
                                {content}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DivIcon>
        ) : null;

        return marker;
    }
}
