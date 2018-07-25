import React from 'react';
import { ConfigEnv } from '../../../config/environment';

class TeamForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let srcValue = `/teams`;
        return (
            <iframe width="100%" height="600" src={srcValue} frameBorder="0"></iframe>
        );
    }
}

export default TeamForm;