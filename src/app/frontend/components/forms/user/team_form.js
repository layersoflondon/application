import React from 'react';


class TeamForm extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div className="m-account-page">
                <div className="section">
                    <h2>Your teams</h2>
                    <ul>
                        <li><a href="#" className="teamlink-owner">Basingstoke Historical
                            Society</a><span className="ownership-indicator">Owner</span>
                        </li>
                        <li><a href="#" className="teamlink-member">Highbrook School</a></li>

                    </ul>
                </div>

                <div className="section">
                    <h2>Join a team</h2>
                    <form className="form--chunky form--over-white">

                        <div className="form-group">
                            <label>Search for a team</label>
                            <input type="text" placeholder="" value="Name"/>
                        </div>

                        <input type="submit" value="Request to join"/>

                    </form>
                </div>

                <div className="section">
                    <h2>Create a new team</h2>

                    <form className="form--chunky form--over-white">

                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" placeholder="" value="Name"/>
                        </div>

                        <p className="helper-text">Team members can create and contribute to team collections, and they
                            can allow their records to be editable by the whole team.</p>
                        <input type="submit" value="Create team"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default TeamForm;