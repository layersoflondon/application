import React,{Component} from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {hasError: null, errorInfo: null};
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true, errorInfo: info});
  }

  render() {
    if( this.state.hasError ) {
      return <span />
    }

    return this.props.children;
  }
}
