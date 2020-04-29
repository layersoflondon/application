import {observable, intercept} from 'mobx';

export default class SingletonUIViewStore {
  // components that we only permit 1 of to be active. ie custom dropdown menu's for filters
  @observable visibleSingletonComponent;

  constructor() {
    this.closeEventHandler = (event) => {
      if(!this.visibleSingletonComponent) return;

      const descendant = event.target.contains(this.visibleSingletonComponent.toggleRef.current) || event.target.contains(this.visibleSingletonComponent.toggleRef.current.parentNode);
      const container  = event.target === this.visibleSingletonComponent.toggleRef.current.parentNode;

      const clickedOuterElement = !descendant||container;
      const currentVisibleComponent = this.visibleSingletonComponent.toggleRef.current.contains(event.target);

      if(clickedOuterElement && !currentVisibleComponent) {
        this.visibleSingletonComponent.setState({visible: false});
      }
    };

    intercept(this, 'visibleSingletonComponent', (update) => {
      if(!this.visibleSingletonComponent) {
        update.newValue.setState({visible: true});
      }else if(this.visibleSingletonComponent === update.newValue) {
        update.newValue.setState({visible: !update.newValue.state.visible});
      }else {
        this.visibleSingletonComponent.setState({visible: false});
      }

      return update;
    });
  }
}
