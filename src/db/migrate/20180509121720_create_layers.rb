class CreateLayers < ActiveRecord::Migration[5.2]
  def change
    create_table :layers do |t|
      t.string :title, null: false
      t.text :description
      t.float :lat
      t.float :lng
      t.date :date_from
      t.date :date_to
      t.integer :layer_type
      t.text :layer_data

      t.timestamps
    end
  end
end
