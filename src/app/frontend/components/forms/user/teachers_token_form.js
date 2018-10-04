import React from 'react';
import Teacher from '../../../sources/teacher';
import DatePicker from 'react-datepicker';
import moment from 'moment';

window.m = moment;
// import 'react-datepicker/dist/react-datepicker.css';

class TeachersTokenForm extends React.Component {
    constructor(props) {
        super(props);

        const token_data = {teacher_token: this.props.user.teacher_token, teacher_token_expires: this.props.user.teacher_token_expires};
        this.state = {token: null, tokenData: token_data, tokenOptions: {expiry: moment().add(1, "hour")}};
    }

    generateToken() {
      Teacher.generateToken(this.props.user.id, this.state.tokenOptions).then((response) => {
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
        {location.origin}/origin/{this.state.tokenData.teacher_token}
      </p>
    }

    render() {
        return (
            <div className="m-account-page">
                {
                    this.state.tokenData.teacher_token &&
                    <div className="wrap">
                        {this.tokenInfo()}
                        <button onClick={this.generateToken.bind(this)}>Re-generate token</button>
                    </div>
                }

                {
                    !this.state.tokenData.teacher_token &&
                    <div className="wrap">
                        <label htmlFor="number">When should this token expire</label>

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
                }
            </div>
        );
    }
}

export default TeachersTokenForm;
