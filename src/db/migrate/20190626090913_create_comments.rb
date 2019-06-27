class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.references :user
      t.references :record

      t.text :content
      t.string :state, null: false

      t.timestamps
    end
  end
end
