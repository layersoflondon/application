import React from 'react';


class RecordsCollections extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="m-account-page m-account-page--records-collections">
                <div className="wrap">
                    <div className="section section--records">
                        <h2>Your records</h2>
                        <ul>
                            <li><a href="#">Ut lacinia mollis imperdiet</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Duis sagittis varius auctor</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a>
                                <button className="edit">Edit</button>
                                <span className="draft-indicator">Draft</span></li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Ut lacinia mollis imperdiet</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Duis sagittis varius auctor</a>
                                <button className="edit">Edit</button>
                                <span className="draft-indicator">Draft</span></li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Ut lacinia mollis imperdiet</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Duis sagittis varius auctor</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a>
                                <button className="edit">Edit</button>
                            </li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a>
                                <button className="edit">Edit</button>
                            </li>
                        </ul>
                    </div>

                    <div className="section section--collections">
                        <h2>Your collections</h2>
                        <h3>Created by you</h3>
                        <ul className="created-by-you">
                            <li><a href="#">Ut lacinia mollis imperdiet</a>
                                <button className="Edit">Edit</button>
                            </li>
                            <li><a href="#">Duis sagittis varius auctor</a>
                                <button className="Edit">Edit</button>
                            </li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a>
                                <button className="Edit">Edit</button>
                            </li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a>
                                <button className="Edit">Edit</button>
                            </li>
                        </ul>
                        <h3>Created by your teams</h3>
                        <ul>
                            <li><a href="#">Ut lacinia mollis imperdiet</a></li>
                            <li><a href="#">Duis sagittis varius auctor</a></li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a></li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a></li>
                            <li><a href="#">Ut lacinia mollis imperdiet</a></li>
                            <li><a href="#">Duis sagittis varius auctor</a></li>
                            <li><a href="#">Proin dapibus ligula sit amet finibus</a></li>
                            <li><a href="#">Aenean scelerisque hendrerit venenatis</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default RecordsCollections;