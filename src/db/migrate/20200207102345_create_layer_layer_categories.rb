class CreateLayerLayerCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :layer_layer_categories do |t|
      t.references :layer, foreign_key: true
      t.references :layer_category, foreign_key: true

      t.timestamps
    end
  end
end
