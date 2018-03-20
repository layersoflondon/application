import {observable} from 'mobx';
import RecordModel from './record_model';

export default class CardModel {
  store;
  id;
  record;
  @observable current;

  constructor(store, id, name, record, current) {
    this.store = store;
    this.id = id;
    this.name = name;
    this.record = new RecordModel(store, record.id, record.name);
    this.current = current;
  }

  toggleCurrent() {
    this.store.cards.map( (c) => { if( c.current ) c.current=false; } );
    this.current = !this.current;
  }
}
