import queryString from 'query-string';

const MODAL_NAMES = [
  'record', 'record_form'
];

const getCurrentModal = (location) => {
  const search  = queryString.parse(location.search);
  const current = Object.keys(search).find((key) => MODAL_NAMES.indexOf(key)>-1);
  
  return current;
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

  if(store) store.toggleModal('record', false);
  
  return queryString.stringify(search);
}

const getValueForModal = (location, modal) => {
  const search  = queryString.parse(location.search);
  return search[modal];
}

window.removeModal = removeModal;

export {getCurrentModal, setCurrentModal, getValueForModal, removeModal, MODAL_NAMES};
