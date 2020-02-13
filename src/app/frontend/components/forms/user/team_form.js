import React from 'react';

class TeamForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let source = "";
        if (this.props.id) {
            source = `/teams/${this.props.id}`
        } else {
            source = '/teams'
        }
        return (
            <iframe width="100%" height="600" src={source} frameBorder="0" data-resizable="true"></iframe>
        );
    }
}

export default TeamForm;