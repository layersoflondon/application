class CreateLayerLayerTerms < ActiveRecord::Migration[5.2]
  def change
    create_table :layer_layer_terms do |t|
      t.references :layer, foreign_key: true
      t.references :layer_term, foreign_key: true

      t.timestamps
    end
  end
end
