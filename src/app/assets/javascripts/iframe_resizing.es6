function resizeIFrameToFitContent( iframe ) {
  iframe.width  = iframe.contentWindow.document.body.scrollWidth;
  iframe.height = iframe.contentWindow.document.body.scrollHeight + 40;
}

window.addEventListener('DOMContentLoaded', function(e) {
  let iframes = window.parent.document.querySelectorAll("iframe[data-resizable=true]");

  for( let i = 0; i < iframes.length; i++) {
    resizeIFrameToFitContent( iframes[i] );
  }
});
