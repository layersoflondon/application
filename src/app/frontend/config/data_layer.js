export const recordPageView = (title) => {
  dataLayerParams.push({
    'event': 'virtualPageview',
    'virtualPagePath': window.location.pathname,
    'virtualPageTitle': title
  });
};

export const recordEvent = (event, data) => {
  dataLayerParams.push(Object.assign({
    'event': event
  },data))
};