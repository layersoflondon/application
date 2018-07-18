class CreateRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :records do |t|
      t.string :title
      t.text :description, null: true
      t.integer :like_count, null: false, default: 0
      t.integer :view_count, null: false, default: 0
      t.integer :state, null: false, default: false
      t.float :lat, null: true
      t.float :lng, null: true
      t.date :date_from, null: true
      t.date :date_to, null: true
      t.text :location, null: true

      t.timestamps
    end
  end
end
