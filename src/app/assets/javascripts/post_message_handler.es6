class PostMessageHandler {
  constructor() {
    this.targetOrigin = window.location.protocol +'//' + window.location.host;
    this.bindClickable();
  }

  bindClickable() {
    $('.clickable').on('click tap', (event) => {
      const elem = $(event.currentTarget);
      // Post a message to the parent window with the data attributes assigned to the clickable element
      parent.postMessage(
        Object.assign(elem.data(),{
          'scope': 'clickable-iframe-element'
        }),
        this.targetOrigin
      );
    });
  }
}

$(() => {
  new PostMessageHandler;
});