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

        console.log("Close");
        // if(this.props.routing.history.length>1) {
        //   this.props.routing.history.goBack();
        // }else {
        //   this.props.routing.push("/map");
        // }

        this.props.trayViewStore.record_id = false;
        this.props.trayViewStore.record = false;
        this.props.routing.push("/map");
      }


      render() {
        return super.render();
      }
    };

    boundClass.displayName = component.name;
    return boundClass;
  }
}
