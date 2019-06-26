class CreateUserRecordComments < ActiveRecord::Migration[5.2]
  def change
    create_table :user_record_comments do |t|
      t.references :user
      t.references :record
      t.references :comment

      t.timestamps
    end
  end
end
