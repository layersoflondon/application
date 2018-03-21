class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.string :title
      t.text :description
      t.integer :like_count
      t.integer :view_count
      t.integer :state
      t.boolean :deleted
      t.float :lat
      t.float :lng
      t.date :date
      t.timestamps
    end
  end
end
