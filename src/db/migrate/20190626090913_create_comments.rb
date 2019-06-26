class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.text :content
      t.integer :state, null: false, default: false

      t.timestamps
    end
  end
end
