import React from 'react';

class RecordsCollections extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let srcValue = `/user/record_collections`;
        return (
            <iframe width="100%" height="600" src={srcValue} frameBorder="0" data-resizable="true"></iframe>
        );
    }
}

export default RecordsCollections;