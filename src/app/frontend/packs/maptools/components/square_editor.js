import React from 'react';
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {getSquare, updateSquare} from "../sources/map_tools_squares";

@inject('mapToolsStore', 'userSession')
@withRouter
@observer
export default class SquareEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  updateSquareState(state) {
    updateSquare(this.props.match.params.id, {state: state}).then((response) => {
      this.props.mapToolsStore.square = response.data;
    });
  }

  componentDidMount() {
    const squareId = parseFloat(this.props.match.params.id);
    this.props.mapToolsStore.setUser(this.props.userSession);

    // this.props.mapToolsStore.setZoom(this.props.mapToolsStore.FULL_ZOOM);
    this.props.mapToolsStore.squareId = squareId;
    this.props.mapToolsStore.squareIsLoading = true;
    getSquare(squareId).then((response) => {
      this.props.mapToolsStore.square = response.data;
      this.props.mapToolsStore.squareIsLoading = false;
    });

    this.reloadSquare();
  }

  reloadSquare() {
    (async () => {
      // const square = await getSquare(this.props.match.params.id);
      // this.props.mapToolsStore.square = square.data;
      // console.log(this.props.mapToolsStore.square);
      this.setState({loading: false});
    })();
  }

  handleGoBackClick(event) {
    this.props.mapToolsStore.square = null;
  }

  renderState_not_started() {
    return <div>
      <span className="surtitle">Untraced</span>
      <hr/>
      <h3>This square needs <strong>tracing</strong>.</h3>
      <p>Would you like to help us trace it?</p>

      <a className="button" href="#" onClick={() => this.updateSquareState('in_progress')}>Begin</a>
      or <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>choose another square</Link>.
    </div>
  }

  renderState_in_progress() {
    return <div>
      <span className="surtitle">In progress: Tracing</span>
      <hr/>
      <p>Please trace all coloured areas which are within, or touching, the square using the tools below.</p>
      <p>Click 'Edit shape' to change the existing ones.</p>
      <button onClick={() => this.updateSquareState('done')}>I'm done!</button>
      or go <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>back to the map</Link>.
    </div>
  }

  renderState_done() {
    return <div>
      <span className="surtitle">Traced</span>
      <hr/>
      <h1>You traced this square!</h1>
      <p>Now another user needs to check that it's correct.</p>
      <hr/>
      <button onClick={() => this.updateSquareState('back_in_progress')}>Reopen for editing</button>
      <br/>
      <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>Back to the map</Link>
    </div>
  }

  renderState_doneCheck() {
    return <div>
      <span className="surtitle">Traced</span>
      <hr/>
      <h1>
        This square needs checking
      </h1>
      <p>
        This square has been traced by another user and needs checking. <br />
        Would you like to check it?
      </p>

      <button onClick={() => this.props.mapToolsStore.overrideRenderStateForSquare('doneChecking')}>Begin</button>
      <br/>
      or <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>choose another square</Link>
    </div>
  }

  renderState_doneChecking() {
    return <div>
      <span className="surtitle">In progress: Checking</span>
      <hr/>
      <h1>
        Please check that:
      </h1>
      <p>All polygons touching the square are drawn.</p>
      <p>The shapes you've drawn match the ones on Booth's map</p>
      <p>All shapes are the right color.</p>
      <p>Hit Edit mode to correct any issues.</p>

      <hr/>
      <button onClick={() => this.updateSquareState('back_in_progress')}>Edit mode</button>
      <br/>
      <button onClick={() => this.updateSquareState('verified')}>Looks good!</button>
      <br/>
      <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>Back to the map</Link>
    </div>
  }

  renderState_flagged() {
    return <span>flagged</span>
  }

  renderState_verified() {
    return <div>
      <span className="surtitle">Traced and Checked</span>
      <hr/>
      <h1>All done!</h1>
      <p>This square has been traced and checked. If you can see any obvious errors you can reopen it for editing.</p>
      <hr/>
      <button onClick={() => this.updateSquareState('back_in_progress')}>Reopen for editing</button>
      <br/>
      <Link to='/maptools/squares' onClick={this.handleGoBackClick.bind(this)}>Back to the map</Link>
    </div>
  }

  render() {
    if (!this.props.userSession.id) {
      return <div className={`m-edit-hint not-logged-in`}>
        <span className="surtitle">Sign in to begin!</span>
        <hr/>
        <h3>You need to be signed in in order to start tracing and checking.</h3>
        <a className="button" href="/users/sign_up">Sign up</a>
         or sign in <a href="/users/sign_in">here</a> to get started!
        <hr/>
        <Link to="/maptools/squares" onClick={this.handleGoBackClick.bind(this)}>Back to map</Link>
      </div>;
    }

    if (this.state.loading || this.props.mapToolsStore.squareIsLoading) {
      return <span>...</span>
    } else {

      const editMode = this.props.mapToolsStore.inEditOrDrawingMode;
      const classNames = `m-edit-hint ${this.props.mapToolsStore.square.state.label} ${editMode ? 'edit-mode' : ''}`;
      
      return <div className={classNames}>
        {this[`renderState_${this.props.mapToolsStore.renderStateForSquare}`]()}
      </div>;
    }
  }
}
