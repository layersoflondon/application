import React from 'react';


class TeachersForm extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="m-account-page">
                <div className="wrap">
                    <p>If you are a teacher, you can activate extra functions which will allow you to share a login with
                        your
                        class. Your pupils can then add a and edit content using your account, which you can then
                        moderate for
                        quality before submitting.</p>
                    <button>Show teacher functions</button>
                </div>
            </div>
        );
    }
}

export default TeachersForm;