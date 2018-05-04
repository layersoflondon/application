import jsonStrigifySafe from 'json-stringify-safe';
import {toJSON} from 'mobx';
import initStore from './index';

export function dehydrate(store) {
  return jsonStringifySafe(toJSON(store, true));
}

export function rehydrate() {
  return initStore(window.__STATE);
}