import React,{Component} from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: null, errorInfo: null};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true, errorInfo: info});

    if(typeof Rollbar !== "undefined") {
      Rollbar.error(error);

      if( window.__USER_PRESENT ) {
        Rollbar.configure({payload: {person: window.__USER}});
      }
    }
  }

  render() {
    if( this.state.hasError ) {
      return <span />
    }

    return this.props.children;
  }
}
