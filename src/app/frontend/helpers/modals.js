import queryString from 'query-string';

const MODAL_NAMES = [
  'record', 'media', 'search', 'layers', 'layer', 'newRecord', 'editRecord', 'newCollection', 'editCollection', 'account'
];

const getCurrentModals = (location) => {
  const search  = queryString.parse(location.search);
  const current = Object.keys(search).filter((key) => MODAL_NAMES.indexOf(key)>-1);
  
  return current;
}

const getCurrentModal = (location) => {
  const current = getCurrentModals(location);
  return current.length ? current[0] : null;
}

const setCurrentModal = (location, modal, value) => {
  const search  = queryString.parse(location.search);
  const current = getCurrentModal(location);

  if(current) {
    search[current] = undefined;
  }

  search[modal] = value;

  return queryString.stringify(search);
}

const removeModal = (location, modal, store) => {
  const search  = queryString.parse(location.search);
  search[modal] = undefined;

  if(store) store.toggleModal(modal, false);
  
  return queryString.stringify(search);
}

const getValueForModal = (location, modal) => {
  const search  = queryString.parse(location.search);
  return search[modal];
};

const getQueryStringParam = getValueForModal;

const appendQueryString = (location, params, remove) => {
  const search  = queryString.parse(location.search);

  params.map((keyValue) => {
    search[keyValue.key] = keyValue.value;
  });

  if(remove) {
    remove.map((key) => {
      search[key] = undefined;
    })
  }

  return queryString.stringify(search);
}

const removeQueryStringParams = (location, params) => {
  const search  = queryString.parse(location.search);

  params.map((key) => {
    search[key] = undefined;
  });

  return queryString.stringify(search);
}

const getQueryStringValue = (location, param) => {
  const search  = queryString.parse(location.search);
  return search[param];
}

const openModalLink = (location, paramObject, opts) => {
  const options = {...opts};
  const search  = queryString.parse(location.search);
  search[paramObject.key] = paramObject.value;

  if(options.remove) options.remove.map((key) => search[key] = undefined);
  
  const searchPath = queryString.stringify(search).replace(/&&/, '');
  return `${location.pathname}?${searchPath}`;
}

const closeModalLink = (location, param) => {
  const search  = queryString.parse(location.search);

  if(Array.isArray(param)) {
    param.map((key) => search[key] = undefined)
  }else {
    search[param] = undefined;
  }
  
  const searchPath = queryString.stringify(search).replace(/&&/, '');
  return `${location.pathname}?${searchPath}`;
}

const searchPath = () => {
  const search = queryString.parse(location.search);
  const string = queryString.stringify(search).replace(/&&/,'');

  return string;
}

export {appendQueryString, closeModalLink, openModalLink, getCurrentModal, getCurrentModals, getQueryStringValue, getQueryStringParam, setCurrentModal, getValueForModal, removeModal, removeQueryStringParams, searchPath, MODAL_NAMES};
