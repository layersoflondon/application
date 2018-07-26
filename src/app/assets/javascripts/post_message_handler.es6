class PostMessageHandler {
  constructor() {
    this.targetOrigin = window.location.protocol +'//' + window.location.host;
    this.bindClickable();
  }

  bindClickable() {
    $('.clickable').on('click tap', (event) => {
      const elem = $(event.currentTarget);
      parent.postMessage(
        {
          'scope': 'clickable-iframe-element',
          'type': elem.data().type,
          'id': elem.data().id,
          'action': (elem.data().action) ? elem.data().action : null
        },
        this.targetOrigin
      );
    });
  }
}

$(() => {
  new PostMessageHandler;
});