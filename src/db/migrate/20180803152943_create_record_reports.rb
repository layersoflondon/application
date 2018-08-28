class CreateRecordReports < ActiveRecord::Migration[5.2]
  def change
    create_table :record_reports do |t|
      t.integer :record_id
      t.string :issue, null: false
      t.string :message, null: false
      t.integer :user_id
      t.string :email

      t.timestamps
    end
  end
end
