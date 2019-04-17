import React from 'react';
import Teacher from '../../../sources/teacher';
import TeachersTokenForm from './teachers_token_form';

class TeachersForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {showTeacherForm: this.props.user.role === 'teacher'};
    }

    showTeacherFunctions() {
        Teacher.switchToTeacher(this.props.user.id).then((response) => {
            this.setState({showTeacherForm: response.data.role === 'teacher'});
        });
    }

    render() {
        return (
            <div className="m-account-page">
                <div className="wrap">
                    {
                        !this.state.showTeacherForm &&
                        <p>
                            If you are a teacher, you can activate extra functions which will allow you to share a login with
                            your class.
                            Your pupils can then add a and edit content using your account, which you can then moderate for
                            quality before submitting.
                        </p> &&
                        <button onClick={this.showTeacherFunctions.bind(this)}>Enable organiser functions</button>
                    }

                    {this.state.showTeacherForm && <TeachersTokenForm user={this.props.user} />}
                </div>
            </div>
        );
    }
}

export default TeachersForm;