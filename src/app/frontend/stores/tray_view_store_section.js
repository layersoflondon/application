import {action, observable, observe, computed, intercept, runInAction} from 'mobx';
import Record from '../sources/record';
import Search from '../sources/search';

import Collection from '../sources/collection';
import User from '../sources/user';
import Team from '../sources/team';

import CardModel from '../models/card';
import pluralize from 'pluralize'

/**
 * The data store for the TrayView
 */
export default class TrayViewRecords {
  @observable records = observable.map();

  @action.bound setRecords(records_data) {
    const records = observable.map();
    records_data.map((record) => records.set(record.id, record));
    this.records.replace(records);
  }
}
