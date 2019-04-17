export const recordPageView = (title) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'virtualPageview',
    'virtualPagePath': window.location.pathname,
    'virtualPageTitle': title
  });
};

export const recordEvent = (event, data) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({
    'event': event
  },data))
};