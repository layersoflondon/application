import React from 'react';
import Teacher from '../../../sources/teacher';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class TeachersTokenForm extends React.Component {
    constructor(props) {
        super(props);

        const token_data = {teacher_token: this.props.user.token, token_expires: this.props.user.token_expires};
        this.state = {token: null, tokenData: token_data, tokenOptions: {expiry: moment().add(1, "week")}};
    }

    generateToken() {
      this.setState({generating: true});

      Teacher.generateToken(this.props.user.id, this.state.tokenOptions).then((response) => {
        const state = this.state;
        state.generating = false;
        state.tokenData = response.data;
        this.setState(state);
      });
    }

    invalidateToken() {
      const state = this.state;
      state.tokenData = {};
      this.setState(state);

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
      return <div>
        <p>
          This is your classroom token. Share this with your students to allow them to log in. When they've added their records, you can publish them from your records list or account view.
        </p>
        <p>
          {location.origin}/classroom/{this.state.tokenData.teacher_token} <button className="delete" onClick={this.invalidateToken.bind(this)}><i className="fa fa-trash"></i></button>
        </p>
      </div>
    }

    resetTokenForm() {
      const state = this.state;
      state.tokenData = {};
      this.setState(state);
    }

    render() {
        const disabled = this.state.generating;
        const label = this.state.generating ? <i className="fa fa-spinner fa-spin"></i> : "Generate";
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

                            <button className="generate-token" onClick={this.generateToken.bind(this)} disabled={disabled}>{label}</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default TeachersTokenForm;
