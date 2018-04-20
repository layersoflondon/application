import {observable, observe, computed} from 'mobx';
import Record from '../sources/record';

/**
 * The data store for the TrayView
 */
export default class TrayViewStore {
  // the TrayViewStore is given its datasource (the cardStore attribute) and it renders it as a list in the tray
  @observable cardStore = null;
  previousCardStore = null;
  @observable visible_record_id = null;
  @observable visible_record = null;

  constructor() {
    // swapping the cardStore will re-rener the tray with the new array of records
    observe(this, 'cardStore', (change) => {
      this.previousCardStore = change.oldValue;
    });

    // mutating the visible_record_id will fetch that record and update the RecordView component with the relevant state
    observe(this, 'visible_record_id', (change) => {
      if( change.newValue ) {
        Record.show(null, this.visible_record_id).then((response) => {
          this.visible_record = response.data
        }).catch((error) => {
          this.visible_record = null;
        });
      }else {
        this.visible_record = null;
      }
    });
  }

  moveToNextCard() {
    const current_card = this.cardStore.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.cardStore.cards.indexOf(current_card);

    const next_cards = this.cardStore.cards.slice(current_index+1);
    const next_card = next_cards.find((c) => !c.is_collection);

    if( next_card ) {
      this.visible_record_id = next_card.id;
    }
  }

  moveToPreviousCard() {
    const current_card = this.cardStore.cards.find((c) => c.id === this.visible_record_id);
    const current_index = this.cardStore.cards.indexOf(current_card);

    const previous_cards = this.cardStore.cards.slice(0, current_index).reverse();
    const previous_card = previous_cards.find((c) => !c.is_collection);

    if( previous_card ) {
      this.visible_record_id = previous_card.id;
    }
  }
}
