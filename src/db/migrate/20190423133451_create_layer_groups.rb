class CreateLayerGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :layer_groups do |t|
      t.string :name
      t.text :description
      t.string :slug
      t.integer :image_id

      t.timestamps
    end
  end
end
