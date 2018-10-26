import React from 'react';
import Teacher from '../../../sources/teacher';
import DatePicker from 'react-datepicker';
import moment from 'moment';

window.m = moment;
// import 'react-datepicker/dist/react-datepicker.css';

class TeachersTokenForm extends React.Component {
    constructor(props) {
        super(props);

        const token_data = {teacher_token: this.props.user.token, token_expires: this.props.user.token_expires};
        this.state = {token: null, tokenData: token_data, tokenOptions: {expiry: moment().add(1, "week")}};
    }

    generateToken() {
      Teacher.generateToken(this.props.user.id, this.state.tokenOptions).then((response) => {
        const state = this.state;
        state.tokenData = response.data;
        this.setState(state);
      });
    }

    invalidateToken() {
        Teacher.invalidateCurrentToken(this.props.user.id, this.state.tokenOptions).then((response) => {
            const state = this.state;
            state.tokenData = response.data;
            this.setState(state);
        });
    }

    setDatetime(date) {
      const options = this.state.tokenOptions;
      options.expiry = date;
      this.setState({tokenOptions: options});
    }

    tokenInfo() {
      return <p>
        {location.origin}/classroom/{this.state.tokenData.teacher_token} <button onClick={this.invalidateToken.bind(this)}>&times; delete</button>
      </p>
    }

    resetTokenForm() {
      const state = this.state;
      state.tokenData = {};
      this.setState(state);
    }

    render() {
        return (
            <div className="m-account-page section section-teacher-token">
                {
                    this.state.tokenData.teacher_token &&
                    <div className="wrap">
                        {this.tokenInfo()}
                        <button onClick={this.resetTokenForm.bind(this)}>Remove & create a new token</button>
                    </div>
                }

                {
                    !this.state.tokenData.teacher_token &&
                    <div className="wrap">
                        <p>
                            To allow your students to sign in, you need to set up their login token. This token is temporary and will allow those whom you share it with to create new records.
                        </p>
                        <label htmlFor="number">When should this token expire: </label>

                        <div className="datepicker-wrapper">
                            <DatePicker
                                selected={this.state.tokenOptions.expiry}
                                onChange={this.setDatetime.bind(this)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="LLL"
                                timeCaption="time"
                            />

                            <button onClick={this.generateToken.bind(this)}>Generate</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default TeachersTokenForm;
