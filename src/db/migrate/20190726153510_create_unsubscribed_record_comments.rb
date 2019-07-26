class CreateUnsubscribedRecordComments < ActiveRecord::Migration[5.2]
  def change
    create_table :unsubscribed_record_comments do |t|
      t.integer :user_id
      t.integer :record_id

      t.timestamps
    end
  end
end
