class CreateCollectionRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :collection_records do |t|
      t.references :collection, foreign_key: true
      t.references :record, foreign_key: true

      t.timestamps
    end
  end
end
