import React from 'react';

export default class RecordViewComponentState {
  static bindComponent(component) {
    const boundClass = class extends component {
      constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);

        this.handleCloseOnClick = this.handleCloseOnClick.bind(this);
      }

      handleCloseOnClick(event) {
        event.preventDefault();

        this.props.trayViewStore.record_id = false;
        this.props.trayViewStore.record = false;

        if(this.props.match.params.collection_id) {
          this.props.router.push(`/map/collections/${this.props.match.params.collection_id}`);
        }else if( this.props.router.history.previousLocalStates>0 ) {
          // this.props.router.goBack();
          this.props.router.push(`/map`);
        }else {
          this.props.router.push(`/map`);
        }
      }

      render() {
        return super.render();
      }
    };

    boundClass.displayName = component.name;
    return boundClass;
  }
}
